import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService } from '@/application/services'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let sut: CategoryService

describe('Category Service', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // category application service
    sut = new CategoryService(inMemoryCategoryRepository)
  })

  describe('createCategory', () => {
    it('deve criar uma nova categoria', async () => {
      const department = await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department',
          description: 'Department description',
        }),
      )

      const category = await sut.createCategory({
        name: 'Category',
        description: 'Category description',
        department,
      })

      expect(category).toBeTruthy()
      expect(category.id).toEqual(inMemoryCategoryRepository.items[0].id)
      expect(category.department.id).toEqual(department.id)
    })
  })

  describe('findCategoryById', () => {
    it('deve retornar uma categoria por id', async () => {
      const department = await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department',
          description: 'Department description',
        }),
      )

      await inMemoryCategoryRepository.save(
        new Category(
          {
            name: 'Electronics',
            description: 'Electronics',
            department,
          },
          'category-id',
        ),
      )

      const category = await sut.findCategoryById('category-id')

      expect(category).toBeTruthy()
      expect(category.id).toEqual('category-id')
    })

    it('deve retornar null se a categoria não existir', async () => {
      const category = await sut.findCategoryById('category-id')

      expect(category).toBeNull()
    })
  })

  describe('findManyCategoriesByIds', () => {
    it('deve retornar uma lista de categoria baseada nos ids recebidos', async () => {
      const department = await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department',
          description: 'Department description',
        }),
      )

      await inMemoryCategoryRepository.save(
        new Category(
          {
            name: 'Department 1',
            description: 'Department description',
            department,
          },
          'category-1',
        ),
      )

      await inMemoryCategoryRepository.save(
        new Category(
          {
            name: 'Department 2',
            description: 'Department description',
            department,
          },
          'category-2',
        ),
      )

      const categories = await sut.findManyCategoriesByIds([
        'category-1',
        'category-2',
      ])

      expect(categories).toBeTruthy()
      expect(categories.length).toEqual(2)
    })
  })

  describe('paginateCategories', () => {
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

      const categories = await sut.paginateCategories(2, 1)

      expect(categories.items.length).toEqual(1)
      expect(categories.pagination.count).toEqual(3)
      expect(categories.pagination.limit).toEqual(1)
      expect(categories.pagination.pagesCount).toEqual(3)
      expect(categories.pagination.currentPage).toEqual(3)
    })
  })

  describe('paginateCategoriesByDepartment', () => {
    it('deve retornar uma lista paginada de categorias de um departamento', async () => {
      const department = await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department 1',
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

      const categories = await sut.paginateCategoriesByDepartment(
        department.id,
        2,
        1,
      )

      expect(categories.items.length).toEqual(1)
      expect(categories.pagination.count).toEqual(3)
      expect(categories.pagination.limit).toEqual(1)
      expect(categories.pagination.pagesCount).toEqual(3)
      expect(categories.pagination.currentPage).toEqual(3)
    })
  })

  describe('updateCategory', () => {
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
          'category-1',
        ),
      )

      const category = await sut.updateCategory('category-1', {
        name: 'Category updated',
        description: 'Category updated description',
        department,
      })

      expect(category).toBeTruthy()
      expect(category.name).toEqual('Category updated')
    })

    it('deve lançar um erro se a categoria não for encontrada', async () => {
      const department = await inMemoryDepartmentRepository.save(
        new Department({
          name: 'Department 1',
          description: 'Department description',
        }),
      )

      expect(async () => {
        await sut.updateCategory('category-id', {
          name: 'Updated Department',
          description: 'Updated Department description',
          department,
        })
      }).rejects.toThrowError('Category not found')
    })
  })
})
