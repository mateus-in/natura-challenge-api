import { describe, it, expect, beforeEach } from 'vitest'

import { DepartmentService } from '@/application/services'
import { PaginateDepartmentsUseCase } from '@/application/use-cases/department'
import { Department } from '@/domain/entities'
import { InMemoryDepartmentRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let departmentService: DepartmentService
let sut: PaginateDepartmentsUseCase

describe('Paginate Departments Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // paginate departments use case
    sut = new PaginateDepartmentsUseCase(departmentService)
  })

  it('deve retornar uma lista paginada de departamentos', async () => {
    await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department 1',
        description: 'Department description',
      }),
    )

    await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department 2',
        description: 'Department description',
      }),
    )

    await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department 3',
        description: 'Department description',
      }),
    )

    const { departments } = await sut.execute({})

    expect(departments.items.length).toEqual(3)
    expect(departments.pagination.count).toEqual(3)
    expect(departments.pagination.limit).toEqual(3)
    expect(departments.pagination.currentPage).toEqual(1)
    expect(departments.pagination.pagesCount).toEqual(1)
  })
})
