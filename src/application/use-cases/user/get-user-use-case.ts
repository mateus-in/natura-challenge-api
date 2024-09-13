import { UserService } from '@/application/services'
import { User } from '@/domain/entities'

interface GetUserUseCaseParams {
  id: string
}

interface GetUserUseCaseResponse {
  user: User
}

export class GetUserUseCase {
  constructor(private userService: UserService) {}

  async execute(params: GetUserUseCaseParams): Promise<GetUserUseCaseResponse> {
    const { id } = params

    const user = await this.userService.findUserById(id)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      user,
    }
  }
}
