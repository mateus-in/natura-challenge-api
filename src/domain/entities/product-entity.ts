import { randomUUID } from 'node:crypto'

interface ProductProps {
  name: string
  description: string
  price: number
  stockQuantity: number
}

export class Product {
  private props: ProductProps
  private _id: string

  constructor(props: ProductProps, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get price() {
    return this.props.price
  }

  get stockQuantity() {
    return this.props.stockQuantity
  }

  update(props: ProductProps) {
    this.props = { ...this.props, ...props }
  }
}
