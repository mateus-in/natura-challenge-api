import { describe, it, expect, beforeEach } from 'vitest'

import { UserService } from '@/application/services'
import { SignInUseCase } from '@/application/use-cases/user'
import { User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import { InMemoryUserRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryUserRepository: InMemoryUserRepository
let userService: UserService
let sut: SignInUseCase

describe('Sign In Use Case', () => {
  beforeEach(() => {
    // in memory repsitories
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    userService = new UserService(inMemoryUserRepository)

    // sign in use case
    sut = new SignInUseCase(userService)
  })

  it('deve retornar um token se o usuário for autenticado com sucesso', async () => {
    await inMemoryUserRepository.save(
      new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: UserRole.USER,
      }),
    )

    const { token } = await sut.execute({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(token).toBeTruthy()
  })

  it('deve gerar um erro se as credenciais estiverem erradas', async () => {
    await expect(
      sut.execute({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid credentials')
  })
})
