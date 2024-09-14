import { describe, it, expect, beforeEach } from 'vitest'

import { OrderService, UserService } from '@/application/services'
import { FetchOrdersHistoryUseCase } from '@/application/use-cases/user'
import { Order, OrderItem, Product, User } from '@/domain/entities'
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
let orderService: OrderService
let userService: UserService
let sut: FetchOrdersHistoryUseCase

describe('FetchOrdersHistoryUseCase', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    orderService = new OrderService(
      inMemoryCartRepository,
      inMemoryOrderRepository,
      inMemoryProductRepository,
    )
    userService = new UserService(inMemoryUserRepository)

    // fetch orders history use case
    sut = new FetchOrdersHistoryUseCase(orderService, userService)
  })

  it('deve retornar os pedidos de um usuário', async () => {
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

    await inMemoryOrderRepository.save(
      new Order({
        user,
        items: [
          new OrderItem({
            product,
            quantity: 3,
            price: product.price,
          }),
        ],
        price: product.price * 3,
      }),
    )

    const orders = await sut.execute({
      userId: user.id,
    })

    expect(orders.length).toEqual(1)
  })

  it('deve lançar um erro se o usuário não for encontrado', async () => {
    await expect(
      sut.execute({
        userId: '2',
      }),
    ).rejects.toThrow('User not found')
  })
})
