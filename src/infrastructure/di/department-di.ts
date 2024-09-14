import { CategoryService, DepartmentService } from '@/application/services'
import {
  CreateDepartmentUseCase,
  GetDepartmentUseCase,
  PaginateDepartmentsUseCase,
  UpdateDepartmentUseCase,
} from '@/application/use-cases/department'
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
export function createDepartmentUseCaseDependencyInjection() {
  return new CreateDepartmentUseCase(departmentService)
}

export function getDepartmentUseCaseDependencyInjection() {
  return new GetDepartmentUseCase(categoryService, departmentService)
}

export function paginateDepartmentsUseCaseDependencyInjection() {
  return new PaginateDepartmentsUseCase(departmentService)
}

export function updateDepartmentUseCaseDependencyInjection() {
  return new UpdateDepartmentUseCase(departmentService)
}
