import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should to able to authenticate', async () => {
    await usersRepository.create({
      name: 'Test',
      email: 'tests@tests.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'tests@tests.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should to able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'tests@tests.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should to able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Test',
      email: 'tests@tests.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'tests@tests.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
