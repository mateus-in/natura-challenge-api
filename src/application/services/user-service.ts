import { User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import { UserRepository } from '@/domain/repositories'

interface CreateUserParams {
  name: string
  email: string
  password: string
  role: UserRole
}

interface UpdateUserParams {
  name: string
  email: string
}

interface SignInParams {
  email: string
  password: string
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private hashPassword(password: string): string {
    return password
  }

  private verifyPassword(password: string, hash: string): boolean {
    return password === hash
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const { name, email, password, role } = params

    return await this.userRepository.save(
      new User({
        name,
        email,
        password: this.hashPassword(password),
        role,
      }),
    )
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email)
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId)
  }

  async signIn(params: SignInParams): Promise<string> {
    const { email, password } = params

    const user = await this.userRepository.findByEmail(email)

    if (!user || !this.verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials')
    }

    return 'token_' + user.id
  }

  async updateUser(id: string, params: UpdateUserParams): Promise<User> {
    const { name, email } = params

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    user.update({
      name,
      email,
      password: user.password,
      role: user.role,
    })

    return await this.userRepository.update(user)
  }
}
