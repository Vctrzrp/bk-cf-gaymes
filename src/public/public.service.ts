import { Injectable } from '@nestjs/common'
import { LeaderboardsService } from '../leaderboards/leaderboards.service'
import { MockStoreService } from '../mock/mock-store.service'

@Injectable()
export class PublicService {
  constructor(
    private readonly store: MockStoreService,
    private readonly leaderboards: LeaderboardsService
  ) {}

  home() {
    return {
      id: 'crossfit-gaymes-2026',
      name: 'Gaymes WODs 2026',
      subtitle: 'Cuatro sábados. Cuatro pruebas. Un campeón.',
      description: 'Competencia individual de CrossFit desarrollada durante los cuatro sábados de agosto. Cada fecha suma puntos para el leaderboard general.',
      registrationStart: '2026-07-01',
      registrationEnd: '2026-07-31',
      eventStart: '2026-08-08',
      eventEnd: '2026-08-29',
      location: 'Ludus Centro',
      mapsUrl: 'https://maps.app.goo.gl/unLjT3s9eNCSsKbMA',
      categories: [],
      wods: this.store.wods.map(wod => ({
        ...wod,
        leaderboard: this.leaderboards.byWod(wod.id).map(entry => ({
          name: entry.name,
          score: entry.score,
          points: entry.points
        }))
      })),
      leaderboard: this.leaderboards.general()
    }
  }
}

