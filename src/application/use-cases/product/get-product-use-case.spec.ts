import { describe, it, expect, beforeEach } from 'vitest'

import { ProductService } from '@/application/services'
import { GetProductUseCase } from '@/application/use-cases/product'
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
let sut: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()
    inMemoryProductRepository = new InMemoryProductRepository()

    // application services
    productService = new ProductService(inMemoryProductRepository)

    // get product use case
    sut = new GetProductUseCase(productService)
  })

  it('deve retornar um produto pelo seu id', async () => {
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
          name: 'Product',
          description: 'Product description',
          price: 100,
          stockQuantity: 10,
        },
        'product-id',
      ),
    )

    await inMemoryProductRepository.associateCategories('product-id', [
      'category-1',
      'category-2',
    ])

    const { product } = await sut.execute({
      id: 'product-id',
    })

    expect(product).toBeTruthy()
    expect(product.id).toEqual(inMemoryProductRepository.items[0].id)
  })

  it('deve lançar um erro se o produto não for encontrado', async () => {
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
          name: 'Product',
          description: 'Product description',
          price: 100,
          stockQuantity: 10,
        },
        'product-id',
      ),
    )

    await inMemoryProductRepository.associateCategories('product-id', [
      'category-1',
      'category-2',
    ])

    await expect(
      sut.execute({
        id: 'product-1',
      }),
    ).rejects.toThrowError('Product not found')
  })
})
