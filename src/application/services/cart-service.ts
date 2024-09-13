import { Cart, CartItem, Product, User } from '@/domain/entities'
import { CartRepository } from '@/domain/repositories'

interface AddItemToCartPrams {
  cart: Cart
  product: Product
  quantity: number
}

export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async addItemToCart(params: AddItemToCartPrams): Promise<Cart> {
    const { cart, product, quantity } = params

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock for product')
    }

    const cartItem = new CartItem({
      product,
      quantity,
    })

    return await this.cartRepository.addItem(cart.id, cartItem)
  }

  async clearCart(cartId: string): Promise<Cart> {
    return await this.cartRepository.clear(cartId)
  }

  async createCart(user: User): Promise<Cart> {
    const cart = new Cart({
      user,
      items: [],
    })

    return await this.cartRepository.save(cart)
  }

  async findCartById(id: string): Promise<Cart | null> {
    return await this.cartRepository.findById(id)
  }

  async removeItemToCart(cartId: string, cartItemId: string): Promise<Cart> {
    return await this.cartRepository.removeItem(cartId, cartItemId)
  }

  async updateItemQuantity(
    cartId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    return await this.cartRepository.updateItem(cartId, cartItemId, quantity)
  }
}
