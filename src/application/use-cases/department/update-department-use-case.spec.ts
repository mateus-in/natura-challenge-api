import { describe, it, expect, beforeEach } from 'vitest'

import { DepartmentService } from '@/application/services'
import { UpdateDepartmentUseCase } from '@/application/use-cases/department'
import { Department } from '@/domain/entities'
import { InMemoryDepartmentRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryDepartmentRepository = new InMemoryDepartmentRepository()
let departmentService: DepartmentService
let sut: UpdateDepartmentUseCase

describe('Update Department Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // application services
    departmentService = new DepartmentService(inMemoryDepartmentRepository)

    // update department use case
    sut = new UpdateDepartmentUseCase(departmentService)
  })

  it('deve atualizar um departamento existente', async () => {
    await inMemoryDepartmentRepository.save(
      new Department(
        {
          name: 'Department',
          description: 'Department description',
        },
        'department-id',
      ),
    )

    const { name } = await sut.execute({
      id: 'department-id',
      name: 'Department updated',
      description: 'Department updated description',
    })

    expect(name).toEqual('Department updated')
  })
})
