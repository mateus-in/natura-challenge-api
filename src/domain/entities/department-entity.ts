import { randomUUID } from 'node:crypto'

interface DepartmentProps {
  name: string
  description: string
}

export class Department {
  private props: DepartmentProps
  private _id: string

  constructor(props: DepartmentProps, id?: string) {
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

  update(props: DepartmentProps) {
    this.props = { ...this.props, ...props }
  }
}
