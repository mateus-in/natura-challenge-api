import { UserService } from '@/application/services'

interface SignInUseCaseParams {
  email: string
  password: string
}

export class SignInUseCase {
  constructor(private userService: UserService) {}

  async execute(params: SignInUseCaseParams) {
    const { email, password } = params

    const token = await this.userService.signIn({ email, password })

    return {
      token,
    }
  }
}
