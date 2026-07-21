import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { MockStoreService } from '../mock/mock-store.service'
import { AssignParticipantDto } from './dto/assign-participant.dto'
import { CreateWodDto } from './dto/create-wod.dto'
import { UpdateWodDto } from './dto/update-wod.dto'

@Injectable()
export class WodsService {
  private readonly logger = new Logger(WodsService.name)
  constructor(private readonly store: MockStoreService) {}

  all() { return this.store.wods }

  find(id: string) {
    const wod = this.store.wods.find(item => item.id === id)
    if (!wod) throw new NotFoundException('WOD no encontrado')
    return wod
  }

  create(dto: CreateWodDto) {
    const timestamp = new Date().toISOString()
    const wod = { id: this.store.id('wod'), ...dto, createdAt: timestamp, updatedAt: timestamp }
    this.store.wods.push(wod)
    this.logger.log(`WOD creado id=${wod.id}`)
    return wod
  }

  update(id: string, dto: UpdateWodDto) {
    const wod = this.find(id)
    Object.assign(wod, dto, { updatedAt: new Date().toISOString() })
    this.logger.log(`WOD actualizado id=${id}`)
    return wod
  }

  remove(id: string) {
    const wod = this.find(id)
    this.store.wods.splice(this.store.wods.indexOf(wod), 1)
    for (let index = this.store.results.length - 1; index >= 0; index--) {
      if (this.store.results[index].wodId === id) this.store.results.splice(index, 1)
    }
    this.logger.log(`WOD eliminado id=${id}`)
    return wod
  }

  participants(wodId: string) {
    this.find(wodId)
    const ids = new Set(this.store.results.filter(result => result.wodId === wodId).map(result => result.participantId))
    return this.store.participants.filter(participant => ids.has(participant.id))
  }

  assign(wodId: string, dto: AssignParticipantDto) {
    this.find(wodId)
    if (!this.store.participants.some(participant => participant.id === dto.participantId)) {
      throw new NotFoundException('Participante no encontrado')
    }
    const existing = this.store.results.find(result => result.wodId === wodId && result.participantId === dto.participantId)
    if (existing) throw new ConflictException('El participante ya está asignado al WOD')
    const timestamp = new Date().toISOString()
    const result = {
      id: this.store.id('result'), wodId, participantId: dto.participantId,
      score: '', points: 0, status: 'pending' as const, createdAt: timestamp, updatedAt: timestamp
    }
    this.store.results.push(result)
    this.logger.log(`Participante ${dto.participantId} asignado a WOD ${wodId}`)
    return result
  }

  unassign(wodId: string, participantId: string) {
    const result = this.store.results.find(item => item.wodId === wodId && item.participantId === participantId)
    if (!result) throw new NotFoundException('Asignación no encontrada')
    this.store.results.splice(this.store.results.indexOf(result), 1)
    this.logger.log(`Participante ${participantId} eliminado de WOD ${wodId}`)
    return result
  }
}

