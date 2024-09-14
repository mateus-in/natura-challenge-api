import { OrderService } from '@/application/services'

interface PaginateOrdersUseCaseParams {
  skip?: number
  take?: number
}

export class PaginateOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(params: PaginateOrdersUseCaseParams) {
    const { skip, take } = params

    const orders = await this.orderService.paginateOrders(skip, take)

    return {
      orders: orders.items.map((order) => {
        return {
          id: order.id,
          user: {
            id: order.user.id,
            email: order.user.email,
            name: order.user.name,
          },
          items: order.items.map((item) => {
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
          price: order.price,
        }
      }),
      pagination: {
        count: orders.pagination.count,
        limit: orders.pagination.limit,
        currentPage: orders.pagination.currentPage,
        pagesCount: orders.pagination.pagesCount,
      },
    }
  }
}
