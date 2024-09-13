import { Order } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { OrderRepository } from '@/domain/repositories'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id === id)

    if (!order) {
      return null
    }

    return order
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Order>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async paginateByUser(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Order>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async save(order: Order): Promise<Order> {
    this.items.push(order)
    return order
  }
}
