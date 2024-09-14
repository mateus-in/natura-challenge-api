import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { Order, OrderItem } from '@/domain/entities'
import { UserMapper, ProductMapper } from '@/shared/mappers'

interface PrismaOrder
  extends Prisma.OrderGetPayload<{
    include: {
      user: true
      items: {
        include: {
          product: true
        }
      }
    }
  }> {}

export class OrderMapper {
  static toDomain(prismaOrder: PrismaOrder): Order {
    return new Order(
      {
        user: UserMapper.toDomain(prismaOrder.user),
        items: prismaOrder.items.map((item) => {
          return new OrderItem(
            {
              product: ProductMapper.toDomain(item.product),
              quantity: item.quantity,
              price: Number(item.product.price),
            },
            item.id,
          )
        }),
        price: prismaOrder.items.reduce((total, item) => {
          return total + Number(item.product.price) * item.quantity
        }, 0),
      },
      prismaOrder.id,
    )
  }

  static toPrisma(order: Order): PrismaOrder {
    return {
      id: order.id,
      user_id: order.user.id,
      user: UserMapper.toPrisma(order.user),
      items: order.items.map((item) => {
        return {
          id: item.id,
          order_id: order.id,
          order,
          product_id: item.product.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            stockQuantity: item.product.stockQuantity,
            price: new Decimal(item.price),
          },
          price: new Decimal(item.price),
          quantity: item.quantity,
        }
      }),
      price: new Decimal(order.price),
    }
  }
}
