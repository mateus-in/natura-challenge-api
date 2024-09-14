import { CartService, ProductService } from '@/application/services'

interface AddItemToCartUseCaseParams {
  userId: string
  cartId: string
  productId: string
  quantity: number
}

export class AddItemToCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async execute(params: AddItemToCartUseCaseParams) {
    const { userId, cartId, productId, quantity } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const itemAlreadyInCart = cart.items.find(
      (item) => item.product.id === productId,
    )

    if (itemAlreadyInCart) {
      throw new Error('Item already in cart')
    }

    const product = await this.productService.findProductById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const updatedCart = await this.cartService.addItemToCart({
      cart,
      product,
      quantity,
    })

    await this.productService.updateProduct(product.id, {
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity - quantity,
    })

    return {
      id: updatedCart.id,
      user: {
        id: updatedCart.user.id,
        email: updatedCart.user.email,
        name: updatedCart.user.name,
      },
      items: updatedCart.items.map((item) => {
        return {
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stockQuantity: item.product.stockQuantity,
          },
          quantity: item.quantity,
        }
      }),
    }
  }
}
