import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, ProductService } from '@/application/services'
import { AddItemToCartUseCase } from '@/application/use-cases/cart'
import { Cart, Product, User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import {
  InMemoryCartRepository,
  InMemoryProductRepository,
  InMemoryUserRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryUserRepository: InMemoryUserRepository
let cartService: CartService
let productService: ProductService
let sut: AddItemToCartUseCase

describe('Add Item To Cart Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    productService = new ProductService(inMemoryProductRepository)

    // add item to cart use case
    sut = new AddItemToCartUseCase(cartService, productService)
  })

  it('deve adicionar um item a um carrinho existente', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
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

    await inMemoryCartRepository.save(
      new Cart(
        {
          user,
          items: [],
        },
        'cart-id',
      ),
    )

    const { cart } = await sut.execute({
      cartId: 'cart-id',
      productId: 'product-id',
      quantity: 2,
    })

    const updatedProduct =
      await inMemoryProductRepository.findById('product-id')

    expect(cart).toBeTruthy()
    expect(cart.items.length).toEqual(1)
    expect(updatedProduct.stockQuantity).toEqual(8)
  })

  it('deve lançar um erro se o carrinho não for encontrado', async () => {
    await expect(
      sut.execute({
        cartId: 'cart-id',
        productId: 'product-id',
        quantity: 2,
      }),
    ).rejects.toThrowError('Cart not found')
  })

  it('deve lançar um erro se o produto não for encontrado', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    await inMemoryCartRepository.save(
      new Cart(
        {
          user,
          items: [],
        },
        'cart-id',
      ),
    )

    await expect(
      sut.execute({
        cartId: 'cart-id',
        productId: 'product-id',
        quantity: 2,
      }),
    ).rejects.toThrowError('Product not found')
  })
})
