import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    eventName: string
}

