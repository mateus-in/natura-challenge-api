import { Cart, CartItem } from '@/domain/entities'
import { CartRepository } from '@/domain/repositories'

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = []

  async addItem(id: string, cartItem: CartItem): Promise<Cart> {
    const cart = this.items.find((cart) => cart.id === id)
    cart.items.push(cartItem)

    return cart
  }

  async fetchItems(cartId: string): Promise<CartItem[]> {
    const cart = await this.findById(cartId)
    return cart.items
  }

  async clear(cartId: string): Promise<Cart> {
    const cart = this.items.find((cart) => cart.id === cartId)
    cart.items = []

    return cart
  }

  async findById(cartId: string): Promise<Cart | null> {
    const cart = this.items.find((c) => c.id === cartId)

    if (!cart) {
      return null
    }

    return cart
  }

  async findByUser(userId: string): Promise<Cart> {
    const cart = this.items.find((cart) => cart.user.id === userId)
    return cart
  }

  async removeItem(id: string, cartItemId: string): Promise<Cart> {
    const cart = await this.findById(id)
    cart.items = cart.items.filter((item) => item.id !== cartItemId)

    return cart
  }

  async save(cart: Cart): Promise<Cart> {
    this.items.push(cart)
    return cart
  }

  async updateItem(
    id: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.findById(id)

    cart.items = cart.items.map((item) => {
      if (item.id === cartItemId) {
        return new CartItem(
          {
            product: item.product,
            quantity,
          },
          item.id,
        )
      }

      return item
    })

    return cart
  }
}
