import { OrderService } from '@/application/services'
import { Order } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

interface PaginateOrdersUseCaseParams {
  skip?: number
  take?: number
}

interface PaginateOrdersUseCaseResponse {
  orders: Paginate<Order>
}

export class PaginateOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    params: PaginateOrdersUseCaseParams,
  ): Promise<PaginateOrdersUseCaseResponse> {
    const { skip, take } = params

    const orders = await this.orderService.paginateOrders(skip, take)

    return { orders }
  }
}
