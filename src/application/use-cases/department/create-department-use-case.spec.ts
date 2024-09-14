import { describe, it, expect, beforeEach } from 'vitest'

import { DepartmentService } from '@/application/services'
import { CreateDepartmentUseCase } from '@/application/use-cases/department'
import { InMemoryDepartmentRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryDepartmentRepository = new InMemoryDepartmentRepository()
let departmentService: DepartmentService
let sut: CreateDepartmentUseCase

describe('Create Department Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // create department use case
    sut = new CreateDepartmentUseCase(departmentService)
  })

  it('deve criar um novo departamento', async () => {
    const { id } = await sut.execute({
      name: 'Department',
      description: 'Department description',
    })

    expect(id).toEqual(inMemoryDepartmentRepository.items[0].id)
  })
})
