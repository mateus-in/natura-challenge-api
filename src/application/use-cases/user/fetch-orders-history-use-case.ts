import { OrderService, UserService } from '@/application/services'

interface FetchOrdersHistoryUseCaseParams {
  userId: string
}

export class FetchOrdersHistoryUseCase {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async execute(params: FetchOrdersHistoryUseCaseParams) {
    const { userId } = params

    const user = await this.userService.findUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const { items } = await this.orderService.paginateOrdersByUser(userId)

    return items.map((item) => {
      return {
        id: item.id,
        user: {
          id: item.user.id,
          email: item.user.email,
          name: item.user.name,
        },
        items: item.items.map((item) => {
          return {
            id: item.id,
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description,
              price: item.product.price,
              stockQuantity: item.product.stockQuantity,
            },
            price: item.price,
            quantity: item.quantity,
          }
        }),
      }
    })
  }
}
