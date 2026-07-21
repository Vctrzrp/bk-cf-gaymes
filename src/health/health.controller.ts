import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Salud')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', persistence: 'mock', timestamp: new Date().toISOString() }
  }
}

