import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString, MinLength } from 'class-validator'
import type { ParticipantStatus } from '../../mock/models'

export class CreateParticipantDto {
  @ApiProperty({ example: 'Valentina' })
  @IsString()
  @MinLength(1)
  firstName: string

  @ApiProperty({ example: 'Rojas' })
  @IsString()
  @MinLength(1)
  lastName: string

  @ApiProperty({ enum: ['active', 'inactive'], default: 'active' })
  @IsIn(['active', 'inactive'])
  status: ParticipantStatus
}

