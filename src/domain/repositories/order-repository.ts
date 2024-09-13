import { Order } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  paginate(skip?: number, take?: number): Promise<Paginate<Order>>
  paginateByUser(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Order>>
  save(order: Order): Promise<Order>
}
