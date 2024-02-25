import {   
  BadRequestException,
  Injectable,
  NotFoundException, } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { ZaLaResponse } from '../common/helpers/response';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>
  ) {}

  async createEvent(body: CreateEventDto): Promise<{}> {
    try {
      const eventExist = await this.eventRepo.findOne({
        where: {eventName: body.eventName}
      })
      if(eventExist){
        throw new BadRequestException(
          ZaLaResponse.BadRequest(
            'Bad Request',
            `An event with ${body.eventName} already exists`,
            '400'
          ),
        );
      }

      const event = await this.eventRepo.save({
        ...body
      })
      return event
    } catch (error) {
      throw new BadRequestException(
        ZaLaResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }
}
