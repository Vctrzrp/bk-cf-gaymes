import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { WodsController } from './wods.controller'
import { WodsService } from './wods.service'

@Module({
  imports: [AuthModule],
  controllers: [WodsController],
  providers: [WodsService],
  exports: [WodsService]
})
export class WodsModule {}

