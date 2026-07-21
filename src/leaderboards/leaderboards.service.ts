import { Injectable, NotFoundException } from '@nestjs/common'
import { MockStoreService } from '../mock/mock-store.service'

@Injectable()
export class LeaderboardsService {
  constructor(private readonly store: MockStoreService) {}

  byWod(wodId: string) {
    if (!this.store.wods.some(wod => wod.id === wodId)) throw new NotFoundException('WOD no encontrado')
    return this.store.results
      .filter(result => result.wodId === wodId)
      .sort((left, right) => right.points - left.points)
      .map((result, index) => ({
        position: index + 1,
        ...result,
        name: this.participantName(result.participantId)
      }))
  }

  general() {
    const totals = new Map<string, number>()
    for (const result of this.store.results) {
      totals.set(result.participantId, (totals.get(result.participantId) ?? 0) + result.points)
    }
    return [...totals.entries()]
      .map(([participantId, points]) => ({ participantId, name: this.participantName(participantId), points }))
      .sort((left, right) => right.points - left.points)
      .map((entry, index) => ({ position: index + 1, ...entry }))
  }

  participant(participantId: string) {
    const participant = this.store.participants.find(item => item.id === participantId)
    if (!participant) throw new NotFoundException('Participante no encontrado')
    const results = this.store.results
      .filter(result => result.participantId === participantId)
      .map(result => ({ ...result, wod: this.store.wods.find(wod => wod.id === result.wodId)?.name }))
    return {
      participantId,
      name: `${participant.firstName} ${participant.lastName}`,
      points: results.reduce((total, result) => total + result.points, 0),
      results
    }
  }

  private participantName(id: string) {
    const participant = this.store.participants.find(item => item.id === id)
    return participant ? `${participant.firstName} ${participant.lastName}` : 'Participante eliminado'
  }
}

