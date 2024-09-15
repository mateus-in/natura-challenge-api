import { CartService, OrderService, UserService } from '@/application/services'
import {
  FetchOrdersHistoryUseCase,
  GetAuthenticatedUserUseCase,
  GetUserUseCase,
  SignInUseCase,
  SignUpUseCase,
} from '@/application/use-cases/user'
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

export function fetchOrdersHistoryUseCaseDependencyInjection() {
  return new FetchOrdersHistoryUseCase(orderService, userService)
}

export function getUserUseCaseDependencyInjection() {
  return new GetUserUseCase(userService)
}

export function getAuthenticatedUserUseCaseDependencyInjection() {
  return new GetAuthenticatedUserUseCase(cartService, userService)
}

export function signInUseCaseDependencyInjection() {
  return new SignInUseCase(userService)
}

export function signUpUseCaseDependencyInjection() {
  return new SignUpUseCase(cartService, userService)
}
