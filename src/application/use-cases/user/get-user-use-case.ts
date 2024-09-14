import { UserService } from '@/application/services'

interface GetUserUseCaseParams {
  id: string
}

export class GetUserUseCase {
  constructor(private userService: UserService) {}

  async execute(params: GetUserUseCaseParams) {
    const { id } = params

    const user = await this.userService.findUserById(id)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
