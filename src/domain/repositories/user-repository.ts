import { User } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  paginate(skip?: number, take?: number): Promise<Paginate<User>>
  save(user: User): Promise<User>
  update(user: User): Promise<User>
}
