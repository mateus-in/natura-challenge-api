import { hash } from 'bcryptjs'
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

  it('deve retornar o usuário se as credenciais forem válidas', async () => {
    const password = await hash('password123', 6)

    await inMemoryUserRepository.save(
      new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password,
        role: UserRole.USER,
      }),
    )

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(user).toBeTruthy()
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
