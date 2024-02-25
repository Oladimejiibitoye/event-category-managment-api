import { Controller, Post, Body} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Ok, ZaLaResponse } from '../common/helpers/response';


@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.createEvent({...createEventDto, eventName: createEventDto.eventName.trim().toLowerCase()});
    return ZaLaResponse.Ok(event, 'Event created', 201);
  }
}
