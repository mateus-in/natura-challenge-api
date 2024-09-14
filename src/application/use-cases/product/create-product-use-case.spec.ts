import { describe, it, expect, beforeEach } from 'vitest'

import { CategoryService, ProductService } from '@/application/services'
import { CreateProductUseCase } from '@/application/use-cases/product'
import { Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
  InMemoryProductRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let inMemoryProductRepository: InMemoryProductRepository
let categoryService: CategoryService
let productService: ProductService
let sut: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()
    inMemoryProductRepository = new InMemoryProductRepository()

    // application services
    categoryService = new CategoryService(inMemoryCategoryRepository)
    productService = new ProductService(inMemoryProductRepository)

    // create product use case
    sut = new CreateProductUseCase(categoryService, productService)
  })

  it('deve criar um novo produto e associar a n categorias existentes', async () => {
    const department = await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department',
        description: 'Department description',
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category(
        {
          name: 'Category 1',
          description: 'Category description',
          department,
        },
        'category-1',
      ),
    )

    await inMemoryCategoryRepository.save(
      new Category(
        {
          name: 'Category 2',
          description: 'Category description',
          department,
        },
        'category-2',
      ),
    )

    const { id, categories } = await sut.execute({
      name: 'Product',
      description: 'Product description',
      price: 99.0,
      stockQuantity: 10,
      categoryIds: ['category-1', 'category-2'],
    })

    expect(id).toEqual(inMemoryProductRepository.items[0].id)
    expect(categories.length).toEqual(2)
  })

  it('deve lançar um erro se alguma das categorias não for encontrada', async () => {
    const department = await inMemoryDepartmentRepository.save(
      new Department({
        name: 'Department',
        description: 'Department description',
      }),
    )

    await inMemoryCategoryRepository.save(
      new Category(
        {
          name: 'Category 1',
          description: 'Category description',
          department,
        },
        'category-1',
      ),
    )

    await inMemoryCategoryRepository.save(
      new Category(
        {
          name: 'Category 2',
          description: 'Category description',
          department,
        },
        'category-2',
      ),
    )

    await expect(
      sut.execute({
        name: 'Product',
        description: 'Product description',
        price: 99.0,
        stockQuantity: 10,
        categoryIds: ['category-1', 'category-3'],
      }),
    ).rejects.toThrowError('One or more categories not found')
  })
})
