import { User } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { UserRepository } from '@/domain/repositories'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<User>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async save(user: User): Promise<User> {
    this.items.push(user)
    return user
  }

  async update(user: User): Promise<User> {
    const index = this.items.findIndex((u) => u.id === user.id)

    this.items[index] = user
    return user
  }
}
