import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignParticipantDto {
  @ApiProperty({ example: 'participant-1' })
  @IsString()
  participantId: string
}

