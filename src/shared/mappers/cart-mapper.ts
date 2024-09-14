import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { Cart, CartItem } from '@/domain/entities'
import { ProductMapper, UserMapper } from '@/shared/mappers'

interface PrismaCart
  extends Prisma.CartGetPayload<{
    include: {
      user: true
      items: {
        include: {
          product: true
        }
      }
    }
  }> {}

export class CartMapper {
  static toDomain(prismaCart: PrismaCart): Cart {
    return new Cart(
      {
        user: UserMapper.toDomain(prismaCart.user),
        items: prismaCart.items.map((item) => {
          return new CartItem(
            {
              product: ProductMapper.toDomain(item.product),
              quantity: item.quantity,
            },
            item.id,
          )
        }),
      },
      prismaCart.id,
    )
  }

  static toPrisma(cart: Cart): PrismaCart {
    return {
      id: cart.id,
      user_id: cart.user.id,
      user: UserMapper.toPrisma(cart.user),
      items: cart.items.map((item) => {
        return {
          id: item.id,
          cart_id: cart.id,
          product_id: item.product.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: new Decimal(item.product.price),
            stockQuantity: item.product.stockQuantity,
          },
          quantity: item.quantity,
        }
      }),
    }
  }
}
