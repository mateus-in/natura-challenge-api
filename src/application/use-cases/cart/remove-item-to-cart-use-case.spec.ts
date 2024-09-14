import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, ProductService } from '@/application/services'
import { RemoveItemToCartUseCase } from '@/application/use-cases/cart'
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
let sut: RemoveItemToCartUseCase

describe('Remove Item To Cart Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    productService = new ProductService(inMemoryProductRepository)

    // remove item to cart use case
    sut = new RemoveItemToCartUseCase(cartService, productService)
  })

  it('deve remover um item de um carrinho existente', async () => {
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

    product.update({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity - 3,
    })

    await inMemoryProductRepository.update(product)

    const { items } = await sut.execute({
      userId: user.id,
      cartId: 'cart-id',
      cartItemId: 'cart-item-id',
    })

    expect(items.length).toEqual(0)
    expect(inMemoryProductRepository.items[0].stockQuantity).toEqual(10)
  })

  it('deve lançar um erro se o carrinho não for encontrado', async () => {
    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
        cartItemId: 'cart-item-id',
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
        userId: 'user-id',
        cartId: 'cart-id',
        cartItemId: 'cart-item-id',
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

    product.update({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity - 3,
    })

    await inMemoryProductRepository.update(product)

    await expect(
      sut.execute({
        userId: 'user-id',
        cartId: 'cart-id',
        cartItemId: 'cart-item-1',
      }),
    ).rejects.toThrowError('Unauthorized user')
  })
})
