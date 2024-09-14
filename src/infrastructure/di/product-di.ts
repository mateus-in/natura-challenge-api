import { CategoryService, ProductService } from '@/application/services'
import {
  CreateProductUseCase,
  GetProductUseCase,
  PaginateProductsUseCase,
  UpdateProductUseCase,
} from '@/application/use-cases/product'
import {
  PrismaCategoryRepository,
  PrismaProductRepository,
} from '../repositories/prisma'

// prisma repositories
const prismaCategoryRepository = new PrismaCategoryRepository()
const prismaProductRepository = new PrismaProductRepository()

// application services
const categoryService = new CategoryService(prismaCategoryRepository)
const productService = new ProductService(prismaProductRepository)

// use cases dependency injections
export function createProductUseCaseDependencyInjection() {
  return new CreateProductUseCase(categoryService, productService)
}

export function getProductUseCaseDependencyInjection() {
  return new GetProductUseCase(productService)
}

export function paginateProductsUseCaseDependencyInjection() {
  return new PaginateProductsUseCase(productService)
}

export function updateProductUseCaseDependencyInjection() {
  return new UpdateProductUseCase(productService)
}
