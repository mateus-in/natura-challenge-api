import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService, DepartmentService } from '@/application/services'
import { UpdateCategoryUseCase } from '@/application/use-cases/category'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let categoryService: CategoryService
let departmentService: DepartmentService
let sut: UpdateCategoryUseCase

describe('Update Category Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    categoryService = new CategoryService(inMemoryCategoryRepository)
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // update category use case
    sut = new UpdateCategoryUseCase(categoryService, departmentService)
  })

  it('deve atualizar uma categoria existente', async () => {
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

    const { name } = await sut.execute({
      id: 'category-id',
      name: 'Category updated',
      description: 'Category updated description',
      departmentId: department.id,
    })

    expect(name).toEqual('Category updated')
  })

  it('deve lançar um erro se o departamento não for encontrado', async () => {
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

    await expect(
      sut.execute({
        id: 'category-id',
        name: 'Category updated',
        description: 'Category updated description',
        departmentId: 'department-id',
      }),
    ).rejects.toThrowError('Department not found')
  })
})
