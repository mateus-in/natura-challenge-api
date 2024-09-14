import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, OrderService, UserService } from '@/application/services'
import { CreateOrderUseCase } from '@/application/use-cases/order'
import { Cart, CartItem, Product, User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import {
  InMemoryCartRepository,
  InMemoryOrderRepository,
  InMemoryProductRepository,
  InMemoryUserRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryUserRepository: InMemoryUserRepository
let cartService: CartService
let orderService: OrderService
let userService: UserService
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    orderService = new OrderService(
      inMemoryCartRepository,
      inMemoryOrderRepository,
      inMemoryProductRepository,
    )
    userService = new UserService(inMemoryUserRepository)

    // create order use case
    sut = new CreateOrderUseCase(cartService, orderService, userService)
  })

  it('deve criar um pedido a partir do carrinho do usuário', async () => {
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
            new CartItem({
              product,
              quantity: 3,
            }),
          ],
        },
        'cart-id',
      ),
    )

    const { items } = await sut.execute({
      userId: user.id,
      cartId: 'cart-id',
    })

    expect(items.length).toEqual(1)
  })

  it('deve lançar um erro se o usuário não for encontrado', async () => {
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
        cartId: 'cart-id',
        userId: 'user-1',
      }),
    ).rejects.toThrow('User not found')
  })

  it('deve lançar um erro se o carrinho não for encontrado', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      }),
    )

    await expect(
      sut.execute({
        cartId: 'cart-id',
        userId: user.id,
      }),
    ).rejects.toThrow('Cart not found')
  })

  it('deve lançar um erro se o usuário não estiver autorizado a acessar o carrinho', async () => {
    await inMemoryUserRepository.save(
      new User(
        {
          name: 'User 1',
          email: 'user1@example.com',
          password: 'password',
          role: UserRole.USER,
        },
        'user-1',
      ),
    )

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
        cartId: 'cart-id',
        userId: 'user-1',
      }),
    ).rejects.toThrow('Unauthorized user')
  })
})
