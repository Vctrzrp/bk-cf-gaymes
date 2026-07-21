import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'
import type { ResultStatus } from '../../mock/models'

export class CreateResultDto {
  @ApiProperty({ example: 'wod-1' })
  @IsString()
  wodId: string

  @ApiProperty({ example: 'participant-1' })
  @IsString()
  participantId: string

  @ApiPropertyOptional({ example: '08:42' })
  @IsOptional()
  @IsString()
  score = ''

  @ApiProperty({ example: 100, minimum: 0 })
  @IsInt()
  @Min(0)
  points: number

  @ApiProperty({ enum: ['pending', 'finished', 'dnf'] })
  @IsIn(['pending', 'finished', 'dnf'])
  status: ResultStatus
}

