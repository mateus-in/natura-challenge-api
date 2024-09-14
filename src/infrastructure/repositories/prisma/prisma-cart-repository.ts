import { CartItem, Cart } from '@/domain/entities'
import { CartRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { CartMapper, ProductMapper, UserMapper } from '@/shared/mappers'

export class PrismaCartRepository implements CartRepository {
  async addItem(id: string, cartItem: CartItem): Promise<Cart> {
    await prisma.cartItem.create({
      data: {
        id: cartItem.id,
        cart_id: id,
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      },
    })

    const cart = await prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return new Cart(
      {
        user: UserMapper.toDomain(cart.user),
        items: cart.items.map((item) => {
          return new CartItem(
            {
              product: ProductMapper.toDomain(item.product),
              quantity: item.quantity,
            },
            item.id,
          )
        }),
      },
      cart.id,
    )
  }

  async clear(id: string): Promise<Cart> {
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: id,
      },
    })

    const cart = await prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return CartMapper.toDomain(cart)
  }

  async findByUser(userId: string): Promise<Cart> {
    const cart = await prisma.cart.findFirst({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return CartMapper.toDomain(cart)
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await prisma.cart.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      return null
    }

    return CartMapper.toDomain(cart)
  }

  async fetchItems(id: string): Promise<CartItem[]> {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cart_id: id,
      },
      include: {
        product: true,
      },
    })

    return cartItems.map((cartItem) => {
      return new CartItem(
        {
          product: ProductMapper.toDomain(cartItem.product),
          quantity: cartItem.quantity,
        },
        cartItem.id,
      )
    })
  }

  async removeItem(id: string, cartItemId: string): Promise<Cart> {
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        cart_id: id,
      },
    })

    const cart = await prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return CartMapper.toDomain(cart)
  }

  async updateItem(
    id: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
        cart_id: id,
      },
      data: {
        quantity,
      },
    })

    const cart = await prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return CartMapper.toDomain(cart)
  }

  async save(cart: Cart): Promise<Cart> {
    const prismaCart = CartMapper.toPrisma(cart)

    const createdCart = await prisma.cart.create({
      data: {
        id: prismaCart.id,
        user_id: prismaCart.user.id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return CartMapper.toDomain(createdCart)
  }
}
