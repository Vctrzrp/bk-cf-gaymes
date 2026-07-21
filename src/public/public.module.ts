import { Module } from '@nestjs/common'
import { LeaderboardsModule } from '../leaderboards/leaderboards.module'
import { PublicController } from './public.controller'
import { PublicService } from './public.service'

@Module({
  imports: [LeaderboardsModule],
  controllers: [PublicController],
  providers: [PublicService]
})
export class PublicModule {}
