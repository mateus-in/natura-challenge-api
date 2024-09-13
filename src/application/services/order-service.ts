import { Cart, Order, OrderItem, Product, User } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import {
  CartRepository,
  OrderRepository,
  ProductRepository,
} from '@/domain/repositories'

export class OrderService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private createOrderItem(product: Product, quantity: number): OrderItem {
    return new OrderItem({
      product,
      quantity,
      price: product.price,
    })
  }

  private async convertCartItemsToOrderItems(
    cart: Cart,
  ): Promise<{ orderItems: OrderItem[]; total: number }> {
    const orderItems: OrderItem[] = []
    let total = 0

    for (const cartItem of cart.items) {
      const product = await this.validateAndGetProduct(
        cartItem.product.id,
        cartItem.quantity,
      )
      const orderItem = this.createOrderItem(product, cartItem.quantity)

      orderItems.push(orderItem)
      total += orderItem.totalPrice()
    }

    return { orderItems, total }
  }

  private async validateAndGetProduct(
    productId: string,
    requiredQuantity: number,
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.stockQuantity < requiredQuantity) {
      throw new Error('Insufficient stock for product')
    }

    product.update({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity - requiredQuantity,
    })

    return await this.productRepository.update(product)
  }

  async createOrderFromCart(cart: Cart, user: User): Promise<Order> {
    const { orderItems, total } = await this.convertCartItemsToOrderItems(cart)

    const order = await this.orderRepository.save(
      new Order({
        user,
        items: orderItems,
        price: total,
      }),
    )

    await this.cartRepository.clear(cart.id)

    return order
  }

  async findOrderById(orderId: string): Promise<Order | null> {
    return await this.orderRepository.findById(orderId)
  }

  async paginateOrders(skip?: number, take?: number): Promise<Paginate<Order>> {
    return await this.orderRepository.paginate(skip, take)
  }

  async paginateOrdersByUser(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Order>> {
    return await this.orderRepository.paginateByUser(userId, skip, take)
  }
}
