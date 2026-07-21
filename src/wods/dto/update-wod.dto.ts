import { PartialType } from '@nestjs/swagger'
import { CreateWodDto } from './create-wod.dto'

export class UpdateWodDto extends PartialType(CreateWodDto) {}

