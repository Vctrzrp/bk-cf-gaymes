import { Injectable, NotFoundException } from '@nestjs/common'
import { mapResult } from '../prisma/mappers'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async byWod(wodId: string) {
    const wod = await this.prisma.wod.findUnique({ where: { id: wodId }, select: { id: true } })
    if (!wod) throw new NotFoundException('WOD no encontrado')
    const results = await this.prisma.result.findMany({
      where: { wodId },
      include: { participant: true },
      orderBy: [{ points: 'desc' }, { updatedAt: 'asc' }]
    })
    return results.map((result, index) => {
      const { participant, ...record } = result
      return {
        position: index + 1,
        ...mapResult(record),
        name: `${participant.firstName} ${participant.lastName}`
      }
    })
  }

  async general() {
    const participants = await this.prisma.participant.findMany({
      where: { results: { some: {} } },
      include: { results: { select: { points: true } } }
    })
    return participants
      .map(participant => ({
        participantId: participant.id,
        name: `${participant.firstName} ${participant.lastName}`,
        points: participant.results.reduce((total, result) => total + result.points, 0)
      }))
      .sort((left, right) => right.points - left.points || left.name.localeCompare(right.name, 'es'))
      .map((entry, index) => ({ position: index + 1, ...entry }))
  }

  async participant(participantId: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id: participantId },
      include: { results: { include: { wod: { select: { name: true } } } } }
    })
    if (!participant) throw new NotFoundException('Participante no encontrado')
    const results = participant.results.map(result => {
      const { wod, ...record } = result
      return { ...mapResult(record), wod: wod.name }
    })
    return {
      participantId,
      name: `${participant.firstName} ${participant.lastName}`,
      points: results.reduce((total, result) => total + result.points, 0),
      results
    }
  }
}
