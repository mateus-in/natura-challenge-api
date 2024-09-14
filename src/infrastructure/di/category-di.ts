import { CategoryService, DepartmentService } from '@/application/services'
import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  PaginateCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@/application/use-cases/category'
import {
  PrismaCategoryRepository,
  PrismaDepartmentRepository,
} from '../repositories/prisma'

// prisma repositories
const prismaCategoryRepository = new PrismaCategoryRepository()
const prismaDepartmentRepository = new PrismaDepartmentRepository()

// application services
const categoryService = new CategoryService(prismaCategoryRepository)
const departmentService = new DepartmentService(prismaDepartmentRepository)

// use cases dependency injections
export function createCategoryUseCaseDependencyInjection() {
  return new CreateCategoryUseCase(categoryService, departmentService)
}

export function getCategoryUseCaseDependencyInjection() {
  return new GetCategoryUseCase(categoryService)
}

export function paginateCategoriesUseCaseDependencyInjection() {
  return new PaginateCategoriesUseCase(categoryService)
}

export function updateCategoryUseCaseDependencyInjection() {
  return new UpdateCategoryUseCase(categoryService, departmentService)
}
