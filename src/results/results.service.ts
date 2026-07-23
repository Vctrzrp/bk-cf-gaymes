import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { mapResult, resultStatusToDb } from '../prisma/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateResultDto } from './dto/create-result.dto'
import { UpdateResultDto } from './dto/update-result.dto'

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name)
  constructor(private readonly prisma: PrismaService) {}

  async all() {
    return (await this.prisma.result.findMany()).map(mapResult)
  }

  async find(id: string) {
    const result = await this.prisma.result.findUnique({ where: { id } })
    if (!result) throw new NotFoundException('Resultado no encontrado')
    return mapResult(result)
  }

  async create(dto: CreateResultDto) {
    await this.ensureReferences(dto.wodId, dto.participantId)
    try {
      const result = await this.prisma.result.create({
        data: {
          wodId: dto.wodId,
          participantId: dto.participantId,
          score: dto.score ?? '',
          points: dto.points,
          status: resultStatusToDb(dto.status)
        }
      })
      this.logger.log(`Resultado creado id=${result.id} wod=${dto.wodId} participante=${dto.participantId}`)
      return mapResult(result)
    } catch (error) {
      this.handleConflict(error)
    }
  }

  async update(id: string, dto: UpdateResultDto) {
    const current = await this.prisma.result.findUnique({ where: { id } })
    if (!current) throw new NotFoundException('Resultado no encontrado')
    const wodId = dto.wodId ?? current.wodId
    const participantId = dto.participantId ?? current.participantId
    await this.ensureReferences(wodId, participantId)
    try {
      const result = await this.prisma.result.update({
        where: { id },
        data: {
          wodId: dto.wodId,
          participantId: dto.participantId,
          score: dto.score,
          points: dto.points,
          status: dto.status ? resultStatusToDb(dto.status) : undefined
        }
      })
      this.logger.log(`Resultado actualizado id=${id}`)
      return mapResult(result)
    } catch (error) {
      this.handleConflict(error)
    }
  }

  async remove(id: string) {
    await this.find(id)
    const result = await this.prisma.result.delete({ where: { id } })
    this.logger.log(`Resultado eliminado id=${id}`)
    return mapResult(result)
  }

  private async ensureReferences(wodId: string, participantId: string) {
    const [wod, participant] = await Promise.all([
      this.prisma.wod.findUnique({ where: { id: wodId }, select: { id: true } }),
      this.prisma.participant.findUnique({ where: { id: participantId }, select: { id: true } })
    ])
    if (!wod) throw new NotFoundException('WOD no encontrado')
    if (!participant) throw new NotFoundException('Participante no encontrado')
  }

  private handleConflict(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Ya existe un resultado para este participante y WOD')
    }
    throw error
  }
}
