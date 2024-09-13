import { describe, it, expect, beforeEach } from 'vitest'

import { OrderService } from '@/application/services'
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
let sut: OrderService

describe('Order Service', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // order application service
    sut = new OrderService(
      inMemoryCartRepository,
      inMemoryOrderRepository,
      inMemoryProductRepository,
    )
  })

  describe('createOrderFromCart', () => {
    it('deve criar um novo pedido a partir do carrinho', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'hash',
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

      const cart = await inMemoryCartRepository.save(
        new Cart({
          user,
          items: [
            new CartItem({
              product,
              quantity: 10,
            }),
          ],
        }),
      )

      const order = await sut.createOrderFromCart(cart, user)

      expect(order).toBeTruthy()
      expect(order.user.id).toEqual(user.id)
      expect(order.items.length).toEqual(1)
    })
  })

  describe('findOrderById', () => {
    it('deve retornar um pedido pelo id', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'hash',
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

      const cart = await inMemoryCartRepository.save(
        new Cart({
          user,
          items: [
            new CartItem({
              product,
              quantity: 10,
            }),
          ],
        }),
      )

      const order = await sut.createOrderFromCart(cart, user)
      const foundOrder = await sut.findOrderById(order.id)

      expect(foundOrder.id).toEqual(foundOrder.id)
    })

    it('deve retornar null se o pedido não for encontrado', async () => {
      const order = await sut.findOrderById('order-id')

      expect(order).toBeNull()
    })
  })

  describe('paginateOrders', () => {
    it('deve retornar uma lista de pedidos paginada', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'hash',
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

      const cart = await inMemoryCartRepository.save(
        new Cart({
          user,
          items: [
            new CartItem({
              product,
              quantity: 10,
            }),
          ],
        }),
      )

      await sut.createOrderFromCart(cart, user)

      const orders = await sut.paginateOrders(0, 1)

      expect(orders.items.length).toEqual(1)
      expect(orders.pagination.count).toEqual(1)
      expect(orders.pagination.limit).toEqual(1)
      expect(orders.pagination.pagesCount).toEqual(1)
      expect(orders.pagination.currentPage).toEqual(1)
    })
  })

  describe('paginateOrdersByUser', () => {
    it('deve retornar uma lista de pedidos paginada por usuário', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'hash',
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

      const cart = await inMemoryCartRepository.save(
        new Cart({
          user,
          items: [
            new CartItem({
              product,
              quantity: 10,
            }),
          ],
        }),
      )

      await sut.createOrderFromCart(cart, user)

      const orders = await sut.paginateOrdersByUser(user.id, 0, 1)

      expect(orders.items.length).toEqual(1)
      expect(orders.pagination.count).toEqual(1)
      expect(orders.pagination.limit).toEqual(1)
      expect(orders.pagination.pagesCount).toEqual(1)
      expect(orders.pagination.currentPage).toEqual(1)
    })
  })
})
