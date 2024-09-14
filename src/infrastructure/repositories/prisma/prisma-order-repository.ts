import { Order } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { OrderRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { OrderMapper } from '@/shared/mappers'

export class PrismaOrderRepository implements OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
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

    if (!order) {
      return null
    }

    return OrderMapper.toDomain(order)
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Order>> {
    const [orders, ordersCount] = await prisma.$transaction([
      prisma.order.findMany({
        skip,
        take,
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count(),
    ])

    return {
      items: orders.map(OrderMapper.toDomain),
      pagination: {
        count: ordersCount,
        limit: take || ordersCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(ordersCount / take),
      },
    }
  }

  async paginateByUser(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Order>> {
    const [orders, ordersCount] = await prisma.$transaction([
      prisma.order.findMany({
        where: {
          user_id: userId,
        },
        skip,
        take,
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count(),
    ])

    return {
      items: orders.map(OrderMapper.toDomain),
      pagination: {
        count: ordersCount,
        limit: take || ordersCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(ordersCount / take),
      },
    }
  }

  async save(order: Order): Promise<Order> {
    const prismaOrder = OrderMapper.toPrisma(order)

    const createdOrder = await prisma.order.create({
      data: {
        id: prismaOrder.id,
        user_id: prismaOrder.user.id,
        price: prismaOrder.price,
        items: {
          createMany: {
            data: prismaOrder.items.map((item) => {
              return {
                id: item.id,
                product_id: item.product_id,
                price: item.price,
                quantity: item.quantity,
              }
            }),
          },
        },
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

    return OrderMapper.toDomain(createdOrder)
  }
}
