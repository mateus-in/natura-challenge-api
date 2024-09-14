import { User } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { UserRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { UserMapper } from '@/shared/mappers'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<User>> {
    const [users, usersCount] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.user.count(),
    ])

    return {
      items: users.map(UserMapper.toDomain),
      pagination: {
        count: usersCount,
        limit: take || usersCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(usersCount / take),
      },
    }
  }

  async save(user: User): Promise<User> {
    const prismaUser = UserMapper.toPrisma(user)

    const createdUser = await prisma.user.create({
      data: prismaUser,
    })

    return UserMapper.toDomain(createdUser)
  }

  async update(user: User): Promise<User> {
    const prismaUser = UserMapper.toPrisma(user)

    const updatedUser = await prisma.user.update({
      where: {
        id: prismaUser.id,
      },
      data: prismaUser,
    })

    return UserMapper.toDomain(updatedUser)
  }
}
