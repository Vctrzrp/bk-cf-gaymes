import { Body, Controller, Delete, Get, Param, Put, Query, Res, UseGuards } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { listRecords, type ListQuery } from '../common/list-query'
import { setListHeaders } from '../common/set-list-headers'
import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { ParticipantsService } from './participants.service'

@ApiTags('Participantes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly service: ParticipantsService) {}

  @Get()
  list(@Query() query: ListQuery, @Res({ passthrough: true }) response: Response) {
    const result = listRecords(this.service.all(), query)
    setListHeaders(response, 'participants', result.start, result.end, result.total)
    return result.data
  }

  @Get(':id')
  find(@Param('id') id: string) { return this.service.find(id) }

  @Post()
  create(@Body() dto: CreateParticipantDto) { return this.service.create(dto) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParticipantDto) { return this.service.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}

