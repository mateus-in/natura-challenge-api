import { describe, it, expect, beforeEach } from 'vitest'

import { OrderService } from '@/application/services'
import { PaginateOrdersUseCase } from '@/application/use-cases/order'
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
let sut: PaginateOrdersUseCase

describe('Create Order Use Case', () => {
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

    // paginate orders use case
    sut = new PaginateOrdersUseCase(orderService)
  })

  it('deve retornar uma lista de pedidos paginada', async () => {
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
      new Order(
        {
          user,
          items: [
            new OrderItem({
              product,
              quantity: 3,
              price: product.price,
            }),
          ],
          price: product.price * 3,
        },
        'cart-id',
      ),
    )

    const { orders } = await sut.execute({})

    expect(orders.items.length).toEqual(1)
    expect(orders.pagination.count).toEqual(1)
    expect(orders.pagination.limit).toEqual(1)
    expect(orders.pagination.currentPage).toEqual(1)
    expect(orders.pagination.pagesCount).toEqual(1)
  })
})
