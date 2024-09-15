import { describe, it, expect, beforeEach } from 'vitest'

import { CartService, UserService } from '@/application/services'
import { GetAuthenticatedUserUseCase } from '@/application/use-cases/user'
import { Cart, User } from '@/domain/entities'
import { UserRole } from '@/domain/enums'
import {
  InMemoryCartRepository,
  InMemoryUserRepository,
} from '@/infrastructure/repositories/in-memory'

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryUserRepository: InMemoryUserRepository
let cartService: CartService
let userService: UserService
let sut: GetAuthenticatedUserUseCase

describe('Get Authenticated User Use Case', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryUserRepository = new InMemoryUserRepository()

    // application services
    cartService = new CartService(inMemoryCartRepository)
    userService = new UserService(inMemoryUserRepository)

    // get user use case
    sut = new GetAuthenticatedUserUseCase(cartService, userService)
  })

  it('deve retornar o usuário autenticado com o seu carrinho', async () => {
    const user = await inMemoryUserRepository.save(
      new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: UserRole.USER,
      }),
    )

    await inMemoryCartRepository.save(
      new Cart({
        user,
        items: [],
      }),
    )

    const { id } = await sut.execute({
      id: user.id,
    })

    expect(id).toBe(user.id)
  })
})
