import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { listRecords, type ListQuery } from '../common/list-query'
import { setListHeaders } from '../common/set-list-headers'
import { CreateResultDto } from './dto/create-result.dto'
import { UpdateResultDto } from './dto/update-result.dto'
import { ResultsService } from './results.service'

@ApiTags('Resultados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get()
  async list(@Query() query: ListQuery, @Res({ passthrough: true }) response: Response) {
    const result = listRecords(await this.service.all(), query)
    setListHeaders(response, 'results', result.start, result.end, result.total)
    return result.data
  }

  @Get(':id')
  find(@Param('id') id: string) { return this.service.find(id) }

  @Post()
  create(@Body() dto: CreateResultDto) { return this.service.create(dto) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) { return this.service.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}
