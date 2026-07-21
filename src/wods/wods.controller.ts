import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { listRecords, type ListQuery } from '../common/list-query'
import { setListHeaders } from '../common/set-list-headers'
import { AssignParticipantDto } from './dto/assign-participant.dto'
import { CreateWodDto } from './dto/create-wod.dto'
import { UpdateWodDto } from './dto/update-wod.dto'
import { WodsService } from './wods.service'

@ApiTags('WODs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wods')
export class WodsController {
  constructor(private readonly service: WodsService) {}

  @Get()
  list(@Query() query: ListQuery, @Res({ passthrough: true }) response: Response) {
    const result = listRecords(this.service.all(), query)
    setListHeaders(response, 'wods', result.start, result.end, result.total)
    return result.data
  }

  @Get(':id')
  find(@Param('id') id: string) { return this.service.find(id) }

  @Post()
  create(@Body() dto: CreateWodDto) { return this.service.create(dto) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWodDto) { return this.service.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }

  @Get(':id/participants')
  participants(@Param('id') id: string) { return this.service.participants(id) }

  @Post(':id/participants')
  assign(@Param('id') id: string, @Body() dto: AssignParticipantDto) { return this.service.assign(id, dto) }

  @Delete(':id/participants/:participantId')
  unassign(@Param('id') id: string, @Param('participantId') participantId: string) {
    return this.service.unassign(id, participantId)
  }
}

