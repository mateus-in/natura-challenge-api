import { randomUUID } from 'node:crypto'

import { CartItem, User } from '@/domain/entities'

interface CartProps {
  user: User
  items: CartItem[]
}

export class Cart {
  private props: CartProps
  private _id: string

  constructor(props: CartProps, id?: string) {
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

  set items(items: CartItem[]) {
    this.props.items = items
  }
}
