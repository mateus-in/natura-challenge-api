import { OrderService, UserService } from '@/application/services'
import { Order } from '@/domain/entities'

interface FetchOrdersHistoryUseCaseParams {
  userId: string
}

interface FetchOrdersHistoryUseCaseResponse {
  orders: Order[]
}

export class FetchOrdersHistoryUseCase {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async execute(
    params: FetchOrdersHistoryUseCaseParams,
  ): Promise<FetchOrdersHistoryUseCaseResponse> {
    const { userId } = params

    const user = await this.userService.findUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const { items } = await this.orderService.paginateOrdersByUser(userId)

    return {
      orders: items,
    }
  }
}
