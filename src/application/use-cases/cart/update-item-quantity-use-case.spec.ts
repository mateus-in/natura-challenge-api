import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, ProductService } from '@/application/services'
import { UpdateItemQuantityUseCase } from '@/application/use-cases/cart'
import { Cart, CartItem, Product, User } from '@/domain/entities'
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
let sut: UpdateItemQuantityUseCase

describe('Update Item Quantity Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    productService = new ProductService(inMemoryProductRepository)

    // update item quantity use case
    sut = new UpdateItemQuantityUseCase(cartService, productService)
  })

  it('deve alterar a quantidade de um item de um carrinho existente', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    const product = await inMemoryProductRepository.save(
      new Product({
        name: 'Product',
        description: 'Product description',
        price: 100,
        stockQuantity: 10,
      }),
    )

    await inMemoryCartRepository.save(
      new Cart(
        {
          user,
          items: [
            new CartItem(
              {
                product,
                quantity: 3,
              },
              'cart-item-id',
            ),
          ],
        },
        'cart-id',
      ),
    )

    const { items } = await sut.execute({
      userId: user.id,
      cartId: 'cart-id',
      cartItemId: 'cart-item-id',
      quantity: 3,
    })

    expect(items[0].quantity).toEqual(3)
    expect(inMemoryProductRepository.items[0].stockQuantity).toEqual(7)
  })

  it('deve lançar um erro se o carrinho não for encontrado', async () => {
    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
        cartItemId: 'cart-item-id',
        quantity: 2,
      }),
    ).rejects.toThrowError('Cart not found')
  })

  it('deve lançar um erro se carrinho não for do usuário informado', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    const product = await inMemoryProductRepository.save(
      new Product({
        name: 'Product',
        description: 'Product description',
        price: 100,
        stockQuantity: 10,
      }),
    )

    await inMemoryCartRepository.save(
      new Cart(
        {
          user,
          items: [
            new CartItem(
              {
                product,
                quantity: 2,
              },
              'cart-item-id',
            ),
          ],
        },
        'cart-id',
      ),
    )

    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
        cartItemId: 'product-id',
        quantity: 1,
      }),
    ).rejects.toThrowError('Unauthorized user')
  })

  it('deve lançar um erro se o item não existir no carrinho', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    const product = await inMemoryProductRepository.save(
      new Product({
        name: 'Product',
        description: 'Product description',
        price: 100,
        stockQuantity: 10,
      }),
    )

    await inMemoryCartRepository.save(
      new Cart(
        {
          user,
          items: [
            new CartItem(
              {
                product,
                quantity: 3,
              },
              'cart-item-id',
            ),
          ],
        },
        'cart-id',
      ),
    )

    await expect(
      sut.execute({
        userId: user.id,
        cartId: 'cart-id',
        cartItemId: 'cart-item-1',
        quantity: 3,
      }),
    ).rejects.toThrowError('Cart item not found')
  })
})
