import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, UserService } from '@/application/services'
import { SignUpUseCase } from '@/application/use-cases/user'
import { User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import {
  InMemoryCartRepository,
  InMemoryUserRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryUserRepository: InMemoryUserRepository
let cartService: CartService
let userService: UserService
let sut: SignUpUseCase

describe('Sign Up Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    userService = new UserService(inMemoryUserRepository)

    // sign up use case
    sut = new SignUpUseCase(cartService, userService)
  })

  it('deve criar um novo usuário quando o e-mail ainda não estiver registrado', async () => {
    const { id } = await sut.execute({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
    })

    expect(inMemoryUserRepository.items[0].id).toEqual(id)
  })

  it('deve criar um carrinho para o usuário criado', async () => {
    const { id } = await sut.execute({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
    })

    expect(inMemoryUserRepository.items[0].id).toEqual(id)
    expect(inMemoryCartRepository.items[0].user.id).toEqual(id)
  })

  it('deve gerar um erro se o e-mail já estiver registrado', async () => {
    await inMemoryUserRepository.save(
      new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.USER,
      }),
    )

    await expect(
      sut.execute({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('User already registered')
  })
})
