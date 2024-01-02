import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      decription: null,
      phone: null,
      latitude: -27.4526083,
      langitude: -48.4088016,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      decription: null,
      phone: null,
      latitude: -27.5477919,
      langitude: -48.4460189,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.4526083,
      userLongitude: -48.4088016,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
