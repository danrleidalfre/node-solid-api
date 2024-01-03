import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (e) {
    if (e instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: e.message })
    }

    return reply.status(500).send()
  }

  return reply.status(201).send()
}
