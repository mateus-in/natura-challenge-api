import { describe, it, expect, beforeEach } from 'vitest'

import { ProductService } from '@/application/services'
import { Product, Category, Department } from '@/domain/entities'
import {
  InMemoryCategoryRepository,
  InMemoryDepartmentRepository,
  InMemoryProductRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryProductRepository: InMemoryProductRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDepartmentRepository: InMemoryDepartmentRepository
let sut: ProductService

describe('Product Service', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDepartmentRepository = new InMemoryDepartmentRepository()

    // product application service
    sut = new ProductService(inMemoryProductRepository)
  })

  describe('associateCategproes', () => {
    it('deve retornar uma lista das categorias associadas a um produto', async () => {
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

      const categories = await sut.associateCategories('product-id', [
        'category-1',
        'category-2',
      ])

      expect(categories.length).toEqual(2)
    })
  })

  describe('createProduct', () => {
    it('deve criar um novo produto', async () => {
      const product = await sut.createProduct({
        name: 'Product',
        description: 'Product description',
        price: 100.0,
        stockQuantity: 10,
      })

      expect(product).toBeTruthy()
      expect(inMemoryProductRepository.items[0].id).toEqual(product.id)
    })
  })

  describe('findProductById', () => {
    it('deve retornar um produto por id', async () => {
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

      const product = await sut.findProductById('product-id')

      expect(product).toBeTruthy()
      expect(product.name).toEqual('Product')
    })

    it('deve retornar null se o produto não existir', async () => {
      const product = await sut.findProductById('product-id')

      expect(product).toBeNull()
    })
  })

  describe('paginateProducts', () => {
    it('deve retornar uma lista paginada de produtos', async () => {
      await inMemoryProductRepository.save(
        new Product({
          name: 'Product 1',
          description: 'Product description',
          price: 100,
          stockQuantity: 10,
        }),
      )

      await inMemoryProductRepository.save(
        new Product({
          name: 'Product 2',
          description: 'Product description',
          price: 200,
          stockQuantity: 5,
        }),
      )

      const products = await sut.paginateProducts(0, 2)

      expect(products.items.length).toEqual(2)
      expect(products.pagination.count).toEqual(2)
      expect(products.pagination.limit).toEqual(2)
      expect(products.pagination.pagesCount).toEqual(1)
      expect(products.pagination.currentPage).toEqual(1)
    })
  })

  describe('paginateProductsByCategory', () => {
    it('deve retornar uma lista paginada de produtos por categoria', async () => {
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
          'category-id',
        ),
      )

      await inMemoryProductRepository.save(
        new Product(
          {
            name: 'Product 1',
            description: 'Product description',
            price: 100,
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
            price: 200,
            stockQuantity: 5,
          },
          'product-2',
        ),
      )

      await inMemoryProductRepository.associateCategories('product-1', [
        'category-id',
      ])

      await inMemoryProductRepository.associateCategories('product-2', [
        'category-id',
      ])

      const products = await sut.paginateProductsByCategory('category-id', 0, 2)

      expect(products.items.length).toEqual(2)
      expect(products.pagination.count).toEqual(2)
      expect(products.pagination.limit).toEqual(2)
      expect(products.pagination.pagesCount).toEqual(1)
      expect(products.pagination.currentPage).toEqual(1)
    })
  })

  describe('paginateProductsByDepartment', () => {
    it('deve retornar uma lista paginada de produtos por departamento', async () => {
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
          'category-id',
        ),
      )

      await inMemoryProductRepository.save(
        new Product(
          {
            name: 'Product 1',
            description: 'Product descripton',
            price: 100,
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
            price: 200,
            stockQuantity: 5,
          },
          'product-2',
        ),
      )

      await inMemoryProductRepository.associateCategories('product-1', [
        'category-id',
      ])

      await inMemoryProductRepository.associateCategories('product-2', [
        'category-id',
      ])

      const products = await sut.paginateProductsByDepartment(
        department.id,
        0,
        2,
      )

      expect(products.items.length).toEqual(2)
      expect(products.pagination.count).toEqual(2)
      expect(products.pagination.limit).toEqual(2)
      expect(products.pagination.pagesCount).toEqual(1)
      expect(products.pagination.currentPage).toEqual(1)
    })
  })

  describe('updateProduct', () => {
    it('deve atualizar um produto existente', async () => {
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

      const product = await sut.updateProduct('product-id', {
        name: 'Product updated',
        description: 'Product description',
        price: 150,
        stockQuantity: 20,
      })

      expect(product).toBeTruthy()
      expect(product.name).toEqual('Product updated')
    })

    it('deve lançar um erro se o produto não for encontrado', async () => {
      await expect(
        sut.updateProduct('1', {
          name: 'Product',
          description: 'Product description',
          price: 100,
          stockQuantity: 10,
        }),
      ).rejects.toThrowError('Product not found')
    })
  })
})
