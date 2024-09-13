import { randomUUID } from 'node:crypto'

import { OrderItem, User } from '@/domain/entities'

interface OrderProps {
  user: User
  items: OrderItem[]
  price: number
}

export class Order {
  private props: OrderProps
  private _id: string

  constructor(props: OrderProps, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }

  get user() {
    return this.props.user
  }

  get items() {
    return this.props.items
  }

  get price() {
    return this.props.price
  }
}
