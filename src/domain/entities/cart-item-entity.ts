import { randomUUID } from 'node:crypto'

import { Product } from '@/domain/entities'

interface CartItemProps {
  product: Product
  quantity: number
}

export class CartItem {
  private props: CartItemProps
  private _id: string

  constructor(props: CartItemProps, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }

  get product() {
    return this.props.product
  }

  get quantity() {
    return this.props.quantity
  }

  getTotalPrice(): number {
    return this.quantity * this.product.price
  }
}
