import { Category, Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { ProductRepository } from '@/domain/repositories'

interface CreateProductProps {
  name: string
  description: string
  price: number
  stockQuantity: number
}

interface UpdateProductProps {
  name: string
  description: string
  price: number
  stockQuantity: number
}

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async associateCategories(
    id: string,
    categoryIds: string[],
  ): Promise<Category[]> {
    return this.productRepository.associateCategories(id, categoryIds)
  }

  async createProduct(params: CreateProductProps): Promise<Product> {
    const { name, description, price, stockQuantity } = params

    return await this.productRepository.save(
      new Product({
        name,
        description,
        price,
        stockQuantity,
      }),
    )
  }

  async findProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id)
  }

  async paginateProducts(
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>> {
    return await this.productRepository.paginate(skip, take)
  }

  async paginateProductsByCategory(
    categoryId: string,
    page: number,
    limit: number,
  ): Promise<Paginate<Product>> {
    return await this.productRepository.paginateByCategory(
      categoryId,
      page,
      limit,
    )
  }

  async paginateProductsByDepartment(
    departmentId: string,
    page: number,
    limit: number,
  ): Promise<Paginate<Product>> {
    return await this.productRepository.paginateByDepartment(
      departmentId,
      page,
      limit,
    )
  }

  async updateProduct(
    id: string,
    params: UpdateProductProps,
  ): Promise<Product> {
    const { name, description, price, stockQuantity } = params

    const productToUpdate = await this.productRepository.findById(id)

    if (!productToUpdate) {
      throw new Error('Product not found')
    }

    productToUpdate.update({
      name,
      description,
      price,
      stockQuantity,
    })

    return await this.productRepository.update(productToUpdate)
  }
}
