import { CartService, ProductService } from '@/application/services'
import {
  AddItemToCartUseCase,
  ClearCartUseCase,
  RemoveItemToCartUseCase,
  UpdateItemQuantityUseCase,
} from '@/application/use-cases/cart'
import {
  PrismaCartRepository,
  PrismaProductRepository,
} from '@/infrastructure/repositories/prisma'

// prisma repositories
const prismaCartRepository = new PrismaCartRepository()
const prismaProductRepository = new PrismaProductRepository()

// application services
const cartService = new CartService(prismaCartRepository)
const productService = new ProductService(prismaProductRepository)

// use cases dependency injections
export function addItemToCartUseCaseDependencyInjection() {
  return new AddItemToCartUseCase(cartService, productService)
}

export function clearCartUseCaseDependencyInjection() {
  return new ClearCartUseCase(cartService, productService)
}

export function removeItemToCartUseCaseDependencyInjection() {
  return new RemoveItemToCartUseCase(cartService, productService)
}

export function updateItemQuantityUseCaseDependencyInjection() {
  return new UpdateItemQuantityUseCase(cartService, productService)
}
