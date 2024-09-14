import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService, DepartmentService } from '@/application/services'
import { CreateCategoryUseCase } from '@/application/use-cases/category'
import { Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let categoryService: CategoryService
let departmentService: DepartmentService
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    categoryService = new CategoryService(inMemoryCategoryRepository)
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // create category use case
    sut = new CreateCategoryUseCase(categoryService, departmentService)
  })

  it('deve criar uma nova categoria dentro de um departamento existente', async () => {
    await inMemoryDepartmentRepository.save(
      new Department(
        {
          name: 'Department',
          description: 'Department description',
        },
        'department-id',
      ),
    )

    const { id, department } = await sut.execute({
      name: 'Category',
      description: 'Category description',
      departmentId: 'department-id',
    })

    expect(id).toEqual(inMemoryCategoryRepository.items[0].id)
    expect(department.id).toEqual(
      inMemoryCategoryRepository.items[0].department.id,
    )
  })

  it('deve lançar um erro se o departamento não for encontrado', async () => {
    await expect(
      sut.execute({
        name: 'Category',
        description: 'Category description',
        departmentId: 'department-id',
      }),
    ).rejects.toThrowError('Department not found')
  })
})
