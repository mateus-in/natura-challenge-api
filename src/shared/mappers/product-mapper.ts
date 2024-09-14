import { Product as PrismaProduct } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { Product } from '@/domain/entities'

export class ProductMapper {
  static toDomain(prismaProduct: PrismaProduct): Product {
    return new Product(
      {
        name: prismaProduct.name,
        description: prismaProduct.description,
        price: Number(prismaProduct.price),
        stockQuantity: prismaProduct.stockQuantity,
      },
      prismaProduct.id,
    )
  }

  static toPrisma(product: Product): PrismaProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: new Decimal(product.price),
      stockQuantity: product.stockQuantity,
    }
  }
}
