import { UserService } from '@/application/services'

interface SignInUseCaseParams {
  email: string
  password: string
}

export class SignInUseCase {
  constructor(private userService: UserService) {}

  async execute(params: SignInUseCaseParams) {
    const { email, password } = params

    const user = await this.userService.signIn({ email, password })

    return {
      user,
    }
  }
}
