import { User as PrismaUser } from '@prisma/client'

import { User } from '@/domain/entities'

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      {
        email: prismaUser.email,
        name: prismaUser.name,
        password: prismaUser.password_hash,
        role: prismaUser.role,
      },
      prismaUser.id,
    )
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password,
      role: user.role,
    }
  }
}
