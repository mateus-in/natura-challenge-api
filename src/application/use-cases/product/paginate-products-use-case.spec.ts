import { describe, it, expect, beforeEach } from 'vitest'

import { ProductService } from '@/application/services'
import { PaginateProductUseCase } from '@/application/use-cases/product'
import { Category, Department, Product } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
  InMemoryProductRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let inMemoryProductRepository: InMemoryProductRepository
let productService: ProductService
let sut: PaginateProductUseCase

describe('Paginate Product Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()
    inMemoryProductRepository = new InMemoryProductRepository()

    // application services
    productService = new ProductService(inMemoryProductRepository)

    // paginate products use case
    sut = new PaginateProductUseCase(productService)
  })

  it('deve paginar produtos por categoria quando categoryId é fornecido', async () => {
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

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 1',
          description: 'Product description',
          price: 10,
          stockQuantity: 10,
        },
        'product-1',
      ),
    )

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 2',
          description: 'Product description',
          price: 20,
          stockQuantity: 20,
        },
        'product-2',
      ),
    )

    await inMemoryProductRepository.associateCategories('product-1', [
      'category-1',
      'category-2',
    ])

    await inMemoryProductRepository.associateCategories('product-2', [
      'category-2',
    ])

    const { products } = await sut.execute({
      categoryId: 'category-2',
    })

    expect(products).toBeTruthy()
    expect(products.items.length).toEqual(2)
  })

  it('deve paginar produtos por departamento quando apenas departmentId é fornecido', async () => {
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

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 1',
          description: 'Product description',
          price: 10,
          stockQuantity: 10,
        },
        'product-1',
      ),
    )

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 2',
          description: 'Product description',
          price: 20,
          stockQuantity: 20,
        },
        'product-2',
      ),
    )

    await inMemoryProductRepository.associateCategories('product-1', [
      'category-1',
      'category-2',
    ])

    await inMemoryProductRepository.associateCategories('product-2', [
      'category-2',
    ])

    const { products } = await sut.execute({
      departmentId: department.id,
    })

    expect(products).toBeTruthy()
    expect(products.items.length).toEqual(2)
  })

  it('deve paginar todos os produtos quando nem departmentId nem categoryId são fornecidos', async () => {
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

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 1',
          description: 'Product description',
          price: 10,
          stockQuantity: 10,
        },
        'product-1',
      ),
    )

    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product 2',
          description: 'Product description',
          price: 20,
          stockQuantity: 20,
        },
        'product-2',
      ),
    )

    await inMemoryProductRepository.associateCategories('product-1', [
      'category-1',
      'category-2',
    ])

    await inMemoryProductRepository.associateCategories('product-2', [
      'category-2',
    ])

    const { products } = await sut.execute({})

    expect(products).toBeTruthy()
    expect(products.items.length).toEqual(2)
  })
})
