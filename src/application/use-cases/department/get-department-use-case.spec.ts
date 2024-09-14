import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService, DepartmentService } from '@/application/services'
import { GetDepartmentUseCase } from '@/application/use-cases/department'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let categoryService: CategoryService
let departmentService: DepartmentService
let sut: GetDepartmentUseCase

describe('Get Department Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    categoryService = new CategoryService(inMemoryCategoryRepository)
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // get department use case
    sut = new GetDepartmentUseCase(categoryService, departmentService)
  })

  it('deve retornar o departamento e suas categorias associadas', async () => {
    const createdDepartment = await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department',
        description: 'Department description',
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category({
        name: 'Category',
        description: 'Category description',
        department: createdDepartment,
      }),
    )

    const { id, categories } = await sut.execute({
      id: createdDepartment.id,
    })

    expect(id).toEqual(createdDepartment.id)
    expect(categories.length).toEqual(1)
  })

  it('deve lançar um erro se o departamento não for encontrado', async () => {
    await expect(
      sut.execute({
        id: 'department-id',
      }),
    ).rejects.toThrowError('Department not found')
  })
})
