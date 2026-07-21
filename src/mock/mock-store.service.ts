import { Injectable, Logger } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { Participant, Result, Wod } from './models'

const now = () => new Date().toISOString()

@Injectable()
export class MockStoreService {
  private readonly logger = new Logger(MockStoreService.name)

  readonly participants: Participant[] = [
    { id: 'participant-1', firstName: 'Valentina', lastName: 'Rojas', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'participant-2', firstName: 'Martina', lastName: 'Silva', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'participant-3', firstName: 'Alex', lastName: 'González', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'participant-4', firstName: 'Camila', lastName: 'Soto', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'participant-5', firstName: 'Diego', lastName: 'Morales', status: 'inactive', createdAt: now(), updatedAt: now() }
  ]

  readonly wods: Wod[] = [
    { id: 'wod-1', name: 'WOD 1', date: '2026-08-08', activities: ['3 rondas por tiempo', '21-15-9 Thrusters', 'Pull-ups', '400 m de carrera'], createdAt: now(), updatedAt: now() },
    { id: 'wod-2', name: 'WOD 2', date: '2026-08-15', activities: ['AMRAP 15 minutos', '10 Deadlifts', '12 Box jumps', '14 Toes-to-bar'], createdAt: now(), updatedAt: now() },
    { id: 'wod-3', name: 'WOD 3', date: '2026-08-22', activities: ['Por tiempo', '50 Wall balls', '30 Clean & Jerks', '20 Handstand push-ups'], createdAt: now(), updatedAt: now() },
    { id: 'wod-4', name: 'WOD 4', date: '2026-08-29', activities: ['Chipper final', '1.000 m de remo', '40 Dumbbell snatches', '20 Burpees over bar'], createdAt: now(), updatedAt: now() }
  ]

  readonly results: Result[] = [
    { id: 'result-1', wodId: 'wod-1', participantId: 'participant-1', score: '08:42', points: 100, status: 'finished', createdAt: now(), updatedAt: now() },
    { id: 'result-2', wodId: 'wod-1', participantId: 'participant-2', score: '09:11', points: 95, status: 'finished', createdAt: now(), updatedAt: now() },
    { id: 'result-3', wodId: 'wod-1', participantId: 'participant-3', score: '09:38', points: 90, status: 'finished', createdAt: now(), updatedAt: now() },
    { id: 'result-4', wodId: 'wod-2', participantId: 'participant-2', score: '8 + 24 reps', points: 100, status: 'finished', createdAt: now(), updatedAt: now() },
    { id: 'result-5', wodId: 'wod-2', participantId: 'participant-1', score: '8 + 16 reps', points: 95, status: 'finished', createdAt: now(), updatedAt: now() },
    { id: 'result-6', wodId: 'wod-2', participantId: 'participant-4', score: '', points: 0, status: 'dnf', createdAt: now(), updatedAt: now() }
  ]

  constructor() {
    this.logger.warn('MockStore inicializado; no se está utilizando PostgreSQL')
  }

  id(prefix: string) {
    return `${prefix}-${randomUUID()}`
  }
}

