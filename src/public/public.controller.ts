import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PublicService } from './public.service'

@ApiTags('Información pública')
@Controller()
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @Get('competitions/featured')
  featured() { return this.service.home() }

  @Get('public/home')
  home() { return this.service.home() }
}

