import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    langitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, langitude } = nearbyGymsQuerySchema.parse(request.body)

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await nearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: langitude,
  })

  return reply.status(200).send({ gyms })
}
