import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { MockStoreService } from '../mock/mock-store.service'
import { CreateResultDto } from './dto/create-result.dto'
import { UpdateResultDto } from './dto/update-result.dto'

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name)
  constructor(private readonly store: MockStoreService) {}

  all() { return this.store.results }

  find(id: string) {
    const result = this.store.results.find(item => item.id === id)
    if (!result) throw new NotFoundException('Resultado no encontrado')
    return result
  }

  create(dto: CreateResultDto) {
    this.ensureReferences(dto.wodId, dto.participantId)
    if (this.store.results.some(item => item.wodId === dto.wodId && item.participantId === dto.participantId)) {
      throw new ConflictException('Ya existe un resultado para este participante y WOD')
    }
    const timestamp = new Date().toISOString()
    const result = { id: this.store.id('result'), ...dto, score: dto.score ?? '', createdAt: timestamp, updatedAt: timestamp }
    this.store.results.push(result)
    this.logger.log(`Resultado creado id=${result.id} wod=${dto.wodId} participante=${dto.participantId}`)
    return result
  }

  update(id: string, dto: UpdateResultDto) {
    const result = this.find(id)
    const wodId = dto.wodId ?? result.wodId
    const participantId = dto.participantId ?? result.participantId
    this.ensureReferences(wodId, participantId)
    const duplicate = this.store.results.some(item => item.id !== id && item.wodId === wodId && item.participantId === participantId)
    if (duplicate) throw new ConflictException('Ya existe un resultado para este participante y WOD')
    Object.assign(result, dto, { updatedAt: new Date().toISOString() })
    this.logger.log(`Resultado actualizado id=${id}`)
    return result
  }

  remove(id: string) {
    const result = this.find(id)
    this.store.results.splice(this.store.results.indexOf(result), 1)
    this.logger.log(`Resultado eliminado id=${id}`)
    return result
  }

  private ensureReferences(wodId: string, participantId: string) {
    if (!this.store.wods.some(item => item.id === wodId)) throw new NotFoundException('WOD no encontrado')
    if (!this.store.participants.some(item => item.id === participantId)) throw new NotFoundException('Participante no encontrado')
  }
}

