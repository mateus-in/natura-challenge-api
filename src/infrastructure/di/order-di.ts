import { CartService, OrderService, UserService } from '@/application/services'
import {
  CreateOrderUseCase,
  PaginateOrdersUseCase,
} from '@/application/use-cases/order'
import {
  PrismaCartRepository,
  PrismaOrderRepository,
  PrismaProductRepository,
  PrismaUserRepository,
} from '@/infrastructure/repositories/prisma'

// prisma repositories
const prismaCartRepository = new PrismaCartRepository()
const prismaOrderRepository = new PrismaOrderRepository()
const prismaProductRepository = new PrismaProductRepository()
const prismaUserRepository = new PrismaUserRepository()

// application services
const cartService = new CartService(prismaCartRepository)
const orderService = new OrderService(
  prismaCartRepository,
  prismaOrderRepository,
  prismaProductRepository,
)
const userService = new UserService(prismaUserRepository)

// use cases dependency injection
export function createOrderUseCaseDependencyInjection() {
  return new CreateOrderUseCase(cartService, orderService, userService)
}

export function paginateOrdersUseCaseDependencyInjection() {
  return new PaginateOrdersUseCase(orderService)
}
