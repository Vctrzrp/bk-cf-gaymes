import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LeaderboardsService } from './leaderboards.service'

@ApiTags('Leaderboards públicos')
@Controller()
export class LeaderboardsController {
  constructor(private readonly service: LeaderboardsService) {}

  @Get('wods/:wodId/leaderboard')
  byWod(@Param('wodId') wodId: string) { return this.service.byWod(wodId) }

  @Get('leaderboards/general')
  general() { return this.service.general() }

  @Get('leaderboards/general/:participantId')
  participant(@Param('participantId') participantId: string) { return this.service.participant(participantId) }
}

