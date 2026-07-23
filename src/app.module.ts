import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { LeaderboardsModule } from './leaderboards/leaderboards.module'
import { LoggingInterceptor } from './common/logging.interceptor'
import { PrismaModule } from './prisma/prisma.module'
import { ParticipantsModule } from './participants/participants.module'
import { PublicModule } from './public/public.module'
import { ResultsModule } from './results/results.module'
import { WodsModule } from './wods/wods.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HealthModule,
    ParticipantsModule,
    WodsModule,
    ResultsModule,
    LeaderboardsModule,
    PublicModule
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }]
})
export class AppModule {}
