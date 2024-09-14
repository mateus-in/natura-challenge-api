import { describe, it, expect, beforeEach } from 'vitest'

import { ProductService } from '@/application/services'
import { UpdateProductUseCase } from '@/application/use-cases/product'
import { Product } from '@/domain/entities'
import { InMemoryProductRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryProductRepository: InMemoryProductRepository
let productService: ProductService
let sut: UpdateProductUseCase

describe('Update Product Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryProductRepository = new InMemoryProductRepository()

    // application services
    productService = new ProductService(inMemoryProductRepository)

    // update product use case
    sut = new UpdateProductUseCase(productService)
  })

  it('deve atualizar um produto existente', async () => {
    await inMemoryProductRepository.save(
      new Product(
        {
          name: 'Product',
          description: 'Product description',
          price: 10,
          stockQuantity: 10,
        },
        'product-1',
      ),
    )

    const { name } = await sut.execute({
      id: 'product-1',
      name: 'Updated Product',
      description: 'Updated product description',
      price: 20,
      stockQuantity: 5,
    })

    expect(name).toEqual('Updated Product')
  })

  it('deve lançar um erro quando o produto não for encontrado', async () => {
    await expect(
      sut.execute({
        id: 'product-1',
        name: 'Updated Product',
        description: 'Updated product description',
        price: 20,
        stockQuantity: 5,
      }),
    ).rejects.toThrowError('Product not found')
  })
})
