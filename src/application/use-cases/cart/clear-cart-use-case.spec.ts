import { describe, it, expect, beforeEach } from 'vitest'

import { ClearCartUseCase } from '@/application/use-cases/cart'
import { CartService, ProductService } from '@/application/services'
import { UserRole } from '@/domain/enums'
import { Cart, CartItem, Product, User } from '@/domain/entities'
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
let sut: ClearCartUseCase

describe('Clear Cart Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    productService = new ProductService(inMemoryProductRepository)

    // clear cart use case
    sut = new ClearCartUseCase(cartService, productService)
  })

  it('deve remover todos os items de um carrinho existente', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    const product = await inMemoryProductRepository.save(
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
          items: [
            new CartItem({
              product,
              quantity: 2,
            }),
          ],
        },
        'cart-id',
      ),
    )

    const { cart } = await sut.execute({
      userId: user.id,
      cartId: 'cart-id',
    })

    expect(cart).toBeTruthy()
    expect(cart.items.length).toEqual(0)
    expect(inMemoryProductRepository.items[0].stockQuantity).toEqual(10)
  })

  it('deve lançar um erro se o carrinho não for encontrado', async () => {
    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
      }),
    ).rejects.toThrowError('Cart not found')
  })

  it('deve lançar um erro se o carrinho não for do usuário informado', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    const product = await inMemoryProductRepository.save(
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
          items: [
            new CartItem({
              product,
              quantity: 3,
            }),
          ],
        },
        'cart-id',
      ),
    )

    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
      }),
    ).rejects.toThrowError('Unauthorized user')
  })
})
