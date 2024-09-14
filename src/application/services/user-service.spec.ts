import { hash } from 'bcryptjs'
import { describe, it, expect, beforeEach } from 'vitest'

import { UserService } from '@/application/services'
import { UserRole } from '@/domain/enums'
import { User } from '@/domain/entities'
import { InMemoryUserRepository } from '@/infrastructure/repositories/in-memory'

let inMemoryUserRepository: InMemoryUserRepository
let sut: UserService

describe('User Service', () => {
  beforeEach(() => {
    // in memory repositories
    inMemoryUserRepository = new InMemoryUserRepository()

    // user application service
    sut = new UserService(inMemoryUserRepository)
  })

  describe('createUser', () => {
    it('deve criar um novo usuário', async () => {
      const user = await sut.createUser({
        name: 'User',
        email: 'user@test.com',
        password: 'password',
        role: UserRole.USER,
      })

      expect(user).toBeTruthy()
      expect(inMemoryUserRepository.items[0].id).toBe(user.id)
    })
  })

  describe('findUserByEmail', () => {
    it('deve retornar um usuário pelo seu email', async () => {
      await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'password',
          role: UserRole.USER,
        }),
      )

      const user = await sut.findUserByEmail('user@test.com')

      expect(user).toBeTruthy()
      expect(user.email).toEqual('user@test.com')
    })

    it('deve retornar null se o usuário não for encontrado', async () => {
      const user = await sut.findUserByEmail('user@email.com')

      expect(user).toBeNull()
    })
  })

  describe('findUserById', () => {
    it('deve retornar um usuário pelo seu id', async () => {
      await inMemoryUserRepository.save(
        new User(
          {
            name: 'User',
            email: 'user@test.com',
            password: 'password',
            role: UserRole.USER,
          },
          'user-id',
        ),
      )

      const user = await sut.findUserById('user-id')

      expect(user).toBeTruthy()
      expect(user.id).toEqual('user-id')
    })

    it('deve retornar null se o usuário não for encontrado', async () => {
      const user = await sut.findUserById('user-id')

      expect(user).toBeNull()
    })
  })

  describe('signIn', () => {
    it('deve autenticar um usuário e retornar um token', async () => {
      const password = await hash('hash', 10)

      await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password,
          role: UserRole.USER,
        }),
      )

      const user = await sut.signIn({
        email: 'user@test.com',
        password: 'hash',
      })

      expect(user).toBeTruthy()
    })

    it('deve lançar um erro se as credenciais forem inválidas', async () => {
      await inMemoryUserRepository.save(
        new User({
          name: 'User',
          email: 'user@test.com',
          password: 'hash',
          role: UserRole.USER,
        }),
      )

      await expect(
        sut.signIn({
          email: 'user@test.com',
          password: 'password',
        }),
      ).rejects.toThrow('Invalid credentials')
    })
  })

  describe('updateUser', () => {
    it('deve atualizar os dados de um usuário existente', async () => {
      const user = await inMemoryUserRepository.save(
        new User(
          {
            name: 'User',
            email: 'user@test.com',
            password: 'hash',
            role: UserRole.USER,
          },
          'user-id',
        ),
      )

      user.update({
        name: 'User updated',
        email: 'userUpdated@test.com',
        password: user.password,
        role: user.role,
      })

      const updatedUser = await inMemoryUserRepository.update(user)

      expect(updatedUser).toBeTruthy()
      expect(updatedUser.name).toEqual('User updated')
    })

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      await expect(
        sut.updateUser('user-id', {
          name: 'User updated',
          email: 'user@test.com',
        }),
      ).rejects.toThrow('User not found')
    })
  })
})
