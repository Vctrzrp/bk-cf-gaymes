import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { mapParticipant, mapResult, mapWod } from '../prisma/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { AssignParticipantDto } from './dto/assign-participant.dto'
import { CreateWodDto } from './dto/create-wod.dto'
import { UpdateWodDto } from './dto/update-wod.dto'

const includeActivities = { activities: { orderBy: { position: 'asc' as const } } }
const activityRows = (activities: string[]) =>
  activities.map((name, position) => ({ name, position }))

@Injectable()
export class WodsService {
  private readonly logger = new Logger(WodsService.name)
  constructor(private readonly prisma: PrismaService) {}

  async all() {
    return (await this.prisma.wod.findMany({ include: includeActivities })).map(mapWod)
  }

  async find(id: string) {
    const wod = await this.prisma.wod.findUnique({ where: { id }, include: includeActivities })
    if (!wod) throw new NotFoundException('WOD no encontrado')
    return mapWod(wod)
  }

  async create(dto: CreateWodDto) {
    const wod = await this.prisma.wod.create({
      data: {
        name: dto.name,
        date: new Date(`${dto.date}T00:00:00.000Z`),
        activities: { create: activityRows(dto.activities) }
      },
      include: includeActivities
    })
    this.logger.log(`WOD creado id=${wod.id}`)
    return mapWod(wod)
  }

  async update(id: string, dto: UpdateWodDto) {
    await this.find(id)
    const wod = await this.prisma.$transaction(async transaction => {
      if (dto.activities) {
        await transaction.wodActivity.deleteMany({ where: { wodId: id } })
      }
      return transaction.wod.update({
        where: { id },
        data: {
          name: dto.name,
          date: dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : undefined,
          activities: dto.activities ? { create: activityRows(dto.activities) } : undefined
        },
        include: includeActivities
      })
    })
    this.logger.log(`WOD actualizado id=${id}`)
    return mapWod(wod)
  }

  async remove(id: string) {
    await this.find(id)
    const wod = await this.prisma.wod.delete({ where: { id }, include: includeActivities })
    this.logger.log(`WOD eliminado id=${id}`)
    return mapWod(wod)
  }

  async participants(wodId: string) {
    await this.find(wodId)
    const results = await this.prisma.result.findMany({
      where: { wodId },
      include: { participant: true }
    })
    return results.map(result => mapParticipant(result.participant))
  }

  async assign(wodId: string, dto: AssignParticipantDto) {
    await this.find(wodId)
    const participant = await this.prisma.participant.findUnique({ where: { id: dto.participantId } })
    if (!participant) throw new NotFoundException('Participante no encontrado')
    try {
      const result = await this.prisma.result.create({
        data: { wodId, participantId: dto.participantId },
      })
      this.logger.log(`Participante ${dto.participantId} asignado a WOD ${wodId}`)
      return mapResult(result)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El participante ya está asignado al WOD')
      }
      throw error
    }
  }

  async unassign(wodId: string, participantId: string) {
    const result = await this.prisma.result.findUnique({
      where: { wodId_participantId: { wodId, participantId } }
    })
    if (!result) throw new NotFoundException('Asignación no encontrada')
    await this.prisma.result.delete({ where: { id: result.id } })
    this.logger.log(`Participante ${participantId} eliminado de WOD ${wodId}`)
    return mapResult(result)
  }
}
