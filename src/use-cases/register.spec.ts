import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })

    const passwordIsHashed = await compare('123456', user.password_hash)

    expect(passwordIsHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'test@test.com'

    await registerUseCase.execute({
      name: 'Test',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Test',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
