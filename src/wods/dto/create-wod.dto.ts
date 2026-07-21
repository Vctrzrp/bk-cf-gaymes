import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsDateString, IsString, MinLength } from 'class-validator'

export class CreateWodDto {
  @ApiProperty({ example: 'WOD 1' })
  @IsString()
  @MinLength(1)
  name: string

  @ApiProperty({ example: '2026-08-08' })
  @IsDateString()
  date: string

  @ApiProperty({ type: [String], example: ['21-15-9 Thrusters', 'Pull-ups'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  activities: string[]
}

