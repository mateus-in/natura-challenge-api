import { describe, it, expect, beforeEach } from 'vitest'

import { UserService } from '@/application/services'
import { GetUserUseCase } from '@/application/use-cases/user'
import { User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import { InMemoryUserRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryUserRepository: InMemoryUserRepository
let userService: UserService
let sut: GetUserUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    userService = new UserService(inMemoryUserRepository)

    // get user use case
    sut = new GetUserUseCase(userService)
  })

  it('deve retornar um usuário pelo id', async () => {
    await inMemoryUserRepository.save(
      new User(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          role: UserRole.USER,
        },
        'user-id',
      ),
    )

    const { user } = await sut.execute({
      id: 'user-id',
    })

    expect(user).toBeTruthy()
    expect(user.id).toBe('user-id')
  })

  it('deve lençar uma exceção se o usuário não for encontrado', async () => {
    await expect(
      sut.execute({
        id: 'user-id',
      }),
    ).rejects.toThrow('User not found')
  })
})
