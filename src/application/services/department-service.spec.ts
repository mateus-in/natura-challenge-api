import { describe, it, expect, beforeEach } from 'vitest'

import { DepartmentService } from '@/application/services'
import { Department } from '@/domain/entities'
import { InMemoryDepartmentRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let sut: DepartmentService

describe('Department Service', () => {
  beforeEach(() => {
    // in memory repositorires
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // department application service
    sut = new DepartmentService(inMemoryDepartmentRepository)
  })

  describe('createDepartment', () => {
    it('deve criar um novo departamento', async () => {
      const department = await sut.createDepartment({
        name: 'Department',
        description: 'Department description',
      })

      expect(department).toBeTruthy()
      expect(inMemoryDepartmentRepository.items[0].id).toEqual(department.id)
    })

    it('deve lançar um erro se o departamento já existir', async () => {
      await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department',
          description: 'Department description',
        }),
      )

      expect(async () => {
        await sut.createDepartment({
          name: 'Department',
          description: 'Department description',
        })
      }).rejects.toThrowError('Department already exists')
    })
  })

  describe('findDepartmentById', () => {
    it('deve retornar um departamento por id', async () => {
      await inMemoryDepartmentRepository.save(
        new Department(
          {
            name: 'Department 1',
            description: 'Department description',
          },
          'department-id',
        ),
      )

      const department = await sut.findDepartmentById('department-id')

      expect(department).toBeTruthy()
      expect(department.id).toEqual('department-id')
    })

    it('deve retornar null se o departamento não existir', async () => {
      const department = await sut.findDepartmentById('department-1')

      expect(department).toBeNull()
    })
  })

  describe('findDepartmentByName', () => {
    it('deve retornar um departamento por nome', async () => {
      await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department',
          description: 'Department description',
        }),
      )

      const department = await sut.findDepartmentByName('Department')

      expect(department).toBeTruthy()
      expect(department.name).toEqual('Department')
    })

    it('deve retornar null se o departamento não existir', async () => {
      const department = await sut.findDepartmentById('department-1')

      expect(department).toBeNull()
    })
  })

  describe('paginateDepartments', () => {
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

      const departments = await sut.paginateDepartments(0, 2)

      expect(departments.items.length).toEqual(2)
      expect(departments.pagination.count).toEqual(3)
      expect(departments.pagination.limit).toEqual(2)
      expect(departments.pagination.pagesCount).toEqual(2)
      expect(departments.pagination.currentPage).toEqual(1)
    })
  })

  describe('updateDepartment', () => {
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

      const department = await sut.updateDepartment('department-id', {
        name: 'Department updated',
        description: 'Department updated description',
      })

      expect(department).toBeTruthy()
      expect(department.name).toEqual('Department updated')
    })

    it('deve lançar um erro se o departamento não for encontrado', async () => {
      expect(async () => {
        await sut.updateDepartment('department-id', {
          name: 'Updated Department',
          description: 'Updated Department description',
        })
      }).rejects.toThrowError('Department not found')
    })

    it('deve lançar um erro se já existir outro departamento com o mesmo nome', async () => {
      await inMemoryDepartmentRepository.save(
        new Department(
          {
            name: 'Department 1',
            description: 'Department description',
          },
          'department-1',
        ),
      )

      await inMemoryDepartmentRepository.save(
        new Department(
          {
            name: 'Department 2',
            description: 'Department description',
          },
          'department-2',
        ),
      )

      expect(async () => {
        await sut.updateDepartment('department-2', {
          name: 'Department 1',
          description: 'Department description',
        })
      }).rejects.toThrowError('Department with the same name already exists')
    })
  })
})
