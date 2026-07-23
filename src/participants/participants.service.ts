import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { mapParticipant, participantStatusToDb } from '../prisma/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'

@Injectable()
export class ParticipantsService {
  private readonly logger = new Logger(ParticipantsService.name)
  constructor(private readonly prisma: PrismaService) {}

  async all() {
    return (await this.prisma.participant.findMany()).map(mapParticipant)
  }

  async find(id: string) {
    const participant = await this.prisma.participant.findUnique({ where: { id } })
    if (!participant) throw new NotFoundException('Participante no encontrado')
    return mapParticipant(participant)
  }

  async create(dto: CreateParticipantDto) {
    const participant = await this.prisma.participant.create({
      data: { ...dto, status: participantStatusToDb(dto.status) }
    })
    this.logger.log(`Participante creado id=${participant.id}`)
    return mapParticipant(participant)
  }

  async update(id: string, dto: UpdateParticipantDto) {
    await this.find(id)
    const participant = await this.prisma.participant.update({
      where: { id },
      data: { ...dto, status: dto.status ? participantStatusToDb(dto.status) : undefined }
    })
    this.logger.log(`Participante actualizado id=${id}`)
    return mapParticipant(participant)
  }

  async remove(id: string) {
    await this.find(id)
    const participant = await this.prisma.participant.delete({ where: { id } })
    this.logger.log(`Participante eliminado id=${id}`)
    return mapParticipant(participant)
  }
}
