import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Test',
      email: 'tests@tests.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password', async () => {
    const { user } = await sut.execute({
      name: 'Test',
      email: 'tests@tests.com',
      password: '123456',
    })

    const passwordIsHashed = await compare('123456', user.password_hash)

    expect(passwordIsHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    const email = 'tests@tests.com'

    await sut.execute({
      name: 'Test',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Test',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
