import { Category, Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { ProductRepository } from '@/domain/repositories'

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = []

  async associateCategories(
    id: string,
    categoryIds: string[],
  ): Promise<Category[]> {
    const categories: Category[] = []

    categoryIds.forEach(() => {
      categories.push({} as Category)
    })

    return categories
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id === id)

    if (!product) {
      return null
    }

    return product
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Product>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async paginateByCategory(
    categoryId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async save(product: Product): Promise<Product> {
    this.items.push(product)
    return product
  }

  async update(product: Product): Promise<Product> {
    const index = this.items.findIndex((prod) => prod.id === product.id)

    this.items[index] = product
    return product
  }
}
