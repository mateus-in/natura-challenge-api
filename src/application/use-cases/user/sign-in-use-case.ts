import { UserService } from '@/application/services'

interface SignInUseCaseParams {
  email: string
  password: string
}

interface SignInUseCaseResponse {
  token: string
}

export class SignInUseCase {
  constructor(private userService: UserService) {}

  async execute(params: SignInUseCaseParams): Promise<SignInUseCaseResponse> {
    const { email, password } = params

    const token = await this.userService.signIn({ email, password })

    return {
      token,
    }
  }
}
