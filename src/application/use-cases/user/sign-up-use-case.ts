import { CartService, UserService } from '@/application/services'
import { UserRole } from '@/domain/enums'

interface SignUpUseCaseParams {
  name: string
  email: string
  password: string
}

export class SignUpUseCase {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async execute(params: SignUpUseCaseParams) {
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
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
