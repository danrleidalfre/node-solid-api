import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }
}
