import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { MockStoreService } from '../mock/mock-store.service'
import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'

@Injectable()
export class ParticipantsService {
  private readonly logger = new Logger(ParticipantsService.name)
  constructor(private readonly store: MockStoreService) {}

  all() { return this.store.participants }

  find(id: string) {
    const participant = this.store.participants.find(item => item.id === id)
    if (!participant) throw new NotFoundException('Participante no encontrado')
    return participant
  }

  create(dto: CreateParticipantDto) {
    const timestamp = new Date().toISOString()
    const participant = { id: this.store.id('participant'), ...dto, createdAt: timestamp, updatedAt: timestamp }
    this.store.participants.push(participant)
    this.logger.log(`Participante creado id=${participant.id}`)
    return participant
  }

  update(id: string, dto: UpdateParticipantDto) {
    const participant = this.find(id)
    Object.assign(participant, dto, { updatedAt: new Date().toISOString() })
    this.logger.log(`Participante actualizado id=${id}`)
    return participant
  }

  remove(id: string) {
    const participant = this.find(id)
    this.store.participants.splice(this.store.participants.indexOf(participant), 1)
    for (let index = this.store.results.length - 1; index >= 0; index--) {
      if (this.store.results[index].participantId === id) this.store.results.splice(index, 1)
    }
    this.logger.log(`Participante eliminado id=${id}`)
    return participant
  }
}

