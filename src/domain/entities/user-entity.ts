import { randomUUID } from 'node:crypto'

import { UserRole } from '@/domain/enums'

interface UserProps {
  email: string
  name: string
  password: string
  role: UserRole
}

export class User {
  private props: UserProps
  private _id: string

  constructor(props: UserProps, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get role() {
    return this.props.role
  }

  get password() {
    return this.props.password
  }

  update(props: UserProps) {
    this.props = { ...this.props, ...props }
  }
}
