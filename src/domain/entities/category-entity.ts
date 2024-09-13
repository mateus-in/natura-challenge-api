import { randomUUID } from 'node:crypto'

import { Department } from '@/domain/entities'

interface CategoryProps {
  name: string
  description: string
  department: Department
}

export class Category {
  private props: CategoryProps
  private _id: string

  constructor(props: CategoryProps, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id(): string {
    return this._id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get department() {
    return this.props.department
  }

  update(props: CategoryProps) {
    this.props = { ...this.props, ...props }
  }
}
