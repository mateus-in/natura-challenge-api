import { CartService, UserService } from '@/application/services'
import { User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'

interface SignUpUseCaseParams {
  name: string
  email: string
  password: string
}

interface SignUpUseCaseResponse {
  user: User
}

export class SignUpUseCase {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async execute(params: SignUpUseCaseParams): Promise<SignUpUseCaseResponse> {
    const { name, email, password } = params

    const userAlteradyExists = await this.userService.findUserByEmail(email)

    if (userAlteradyExists) {
      throw new Error('User already registered')
    }

    const user = await this.userService.createUser({
      name,
      email,
      password,
      role: UserRole.USER,
    })

    await this.cartService.createCart(user)

    return {
      user,
    }
  }
}
