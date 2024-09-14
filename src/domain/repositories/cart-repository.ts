import { Cart, CartItem } from '@/domain/entities'

export interface CartRepository {
  addItem(id: string, cartItem: CartItem): Promise<Cart>
  clear(id: string): Promise<Cart>
  findByUser(userId: string): Promise<Cart>
  findById(id: string): Promise<Cart | null>
  fetchItems(id: string): Promise<CartItem[]>
  removeItem(id: string, cartItemId: string): Promise<Cart>
  updateItem(id: string, cartItemId: string, quantity: number): Promise<Cart>
  save(cart: Cart): Promise<Cart>
}
