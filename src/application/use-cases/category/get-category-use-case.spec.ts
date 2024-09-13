import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService } from '@/application/services'
import { GetCategoryUseCase } from '@/application/use-cases/category'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let categoryService: CategoryService
let sut: GetCategoryUseCase

describe('Get Category Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    categoryService = new CategoryService(inMemoryCategoryRepository)

    // get categories use case
    sut = new GetCategoryUseCase(categoryService)
  })

  it('deve retornar uma categoria pelo id', async () => {
    const department = await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department',
        description: 'Department description',
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category(
        {
          name: 'Category',
          description: 'Category description',
          department,
        },
        'category-id',
      ),
    )

    const { category } = await sut.execute({
      id: 'category-id',
    })

    expect(category).toBeTruthy()
    expect(category.id).toEqual(inMemoryCategoryRepository.items[0].id)
  })

  it('deve lançar um erro se a categoria não for encontrada', async () => {
    await expect(
      sut.execute({
        id: 'category-id',
      }),
    ).rejects.toThrowError('Category not found')
  })
})
