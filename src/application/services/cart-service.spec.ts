import { describe, it, expect, beforeEach } from 'vitest'

import { CartService } from '@/application/services'
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
let sut: CartService

describe('Cart Service', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // cart application service
    sut = new CartService(inMemoryCartRepository)
  })

  describe('addItemToCart', () => {
    it('deve adicionar um item ao carrinho', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const cart = await sut.createCart(user)

      const product = await inMemoryProductRepository.save(
        new Product({
          name: 'Product',
          description: 'Description',
          price: 100,
          stockQuantity: 10,
        }),
      )

      const updatedCart = await sut.addItemToCart({
        cart,
        product,
        quantity: 2,
      })

      expect(updatedCart).toBeTruthy()
      expect(updatedCart.user.id).toBe(user.id)
      expect(updatedCart.items.length).toEqual(1)
    })

    it('deve lançar um erro se o estoque do produto for insuficiente', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const cart = await sut.createCart(user)

      const product = await inMemoryProductRepository.save(
        new Product({
          name: 'Product',
          description: 'Description',
          price: 100,
          stockQuantity: 1,
        }),
      )

      await expect(
        sut.addItemToCart({
          cart,
          product,
          quantity: 2,
        }),
      ).rejects.toThrow('Insufficient stock for product')
    })
  })

  describe('clearCart', () => {
    it('deve limpar o carrinho', async () => {
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
          description: 'Description',
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
              quantity: 2,
            }),
          ],
        }),
      )

      const updatedCart = await sut.clearCart(cart.id)

      expect(updatedCart).toBeTruthy()
      expect(updatedCart.items).toEqual([])
      expect(updatedCart.user.id).toEqual(user.id)
    })
  })

  describe('createCart', () => {
    it('deve criar um novo carrinho para o usuário', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const cart = await sut.createCart(user)

      expect(cart).toBeTruthy()
      expect(cart.user.id).toBe(user.id)
      expect(cart.items).toEqual([])
    })
  })

  describe('findCartById', () => {
    it('deve retornar um carrinho pelo seu id', async () => {
      const user = new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password',
        role: UserRole.USER,
      })

      await inMemoryCartRepository.save(
        new Cart(
          {
            user,
            items: [],
          },
          'cart-id',
        ),
      )

      const cart = await sut.findCartById('cart-id')

      expect(cart).toBeTruthy()
      expect(cart.user.id).toEqual(user.id)
    })

    it('deve retornar null se o carrinho não for encontrado', async () => {
      const cart = await sut.findCartById('cart-id')

      expect(cart).toBeNull()
    })
  })

  describe('removeItemToCart', () => {
    it('deve remover um item do carrinho', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const cart = await sut.createCart(user)

      const product = await inMemoryProductRepository.save(
        new Product({
          name: 'Product',
          description: 'Description',
          price: 100,
          stockQuantity: 10,
        }),
      )

      await sut.addItemToCart({
        cart,
        product,
        quantity: 2,
      })

      const updatedCart = await sut.removeItemToCart(cart.id, cart.items[0].id)

      expect(updatedCart.items.length).toEqual(0)
    })
  })

  describe('updateItemQuantity', () => {
    it('deve atualizar a quantidade de um item do carrinho', async () => {
      const user = await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const cart = await sut.createCart(user)

      const product = await inMemoryProductRepository.save(
        new Product({
          name: 'Product',
          description: 'Description',
          price: 100,
          stockQuantity: 10,
        }),
      )

      await sut.addItemToCart({
        cart,
        product,
        quantity: 2,
      })

      const updatedCart = await sut.updateItemQuantity(
        cart.id,
        cart.items[0].id,
        3,
      )

      expect(updatedCart.items[0].quantity).toEqual(3)
    })
  })
})
