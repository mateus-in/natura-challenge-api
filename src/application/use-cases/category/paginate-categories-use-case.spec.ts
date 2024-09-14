import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService } from '@/application/services'
import { PaginateCategoriesUseCase } from '@/application/use-cases/category'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let categorySerice: CategoryService
let sut: PaginateCategoriesUseCase

describe('Paginate Categories Use Case', () => {
  beforeEach(() => {
    // in memory categories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    categorySerice = new CategoryService(inMemoryCategoryRepository)

    // paginate categories use case
    sut = new PaginateCategoriesUseCase(categorySerice)
  })

  it('deve retornar uma lista paginada de categorias', async () => {
    const department = await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department',
        description: 'Department description',
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category({
        name: 'Category 1',
        description: 'Category description',
        department,
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category({
        name: 'Category 2',
        description: 'Category description',
        department,
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category({
        name: 'Category 3',
        description: 'Category description',
        department,
      }),
    )

    const { categories, pagination } = await sut.execute({})

    expect(categories.length).toEqual(3)
    expect(pagination.count).toEqual(3)
    expect(pagination.limit).toEqual(3)
    expect(pagination.currentPage).toEqual(1)
    expect(pagination.pagesCount).toEqual(1)
  })
})
