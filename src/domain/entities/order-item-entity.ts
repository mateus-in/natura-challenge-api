import { randomUUID } from 'node:crypto'

import { Product } from '@/domain/entities/'

interface OrderItemProps {
  product: Product
  quantity: number
  price: number
}

export class OrderItem {
  private props: OrderItemProps
  private _id: string

  constructor(props: OrderItemProps, id?: string) {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    if (props.price < 0) {
      throw new Error('Price must be greater than or equal to 0')
    }

    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }

  get quantity() {
    return this.props.quantity
  }

  get price() {
    return this.props.price
  }

  get product() {
    return this.props.product
  }

  totalPrice(): number {
    return this.quantity * this.price
  }
}
