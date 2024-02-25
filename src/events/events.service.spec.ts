import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepo: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository, // Use a mock repository for testing
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  const event = new Event();

  describe('createEvent', () => {
    it('should create an event', async () => {
      const body = { eventName: 'Wedding' };
      event.eventName = body.eventName;

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(null); // Mock event not found
      jest.spyOn(eventRepo, 'save').mockResolvedValue(event); // Mock save operation

      await expect(service.createEvent(body)).resolves.toEqual(event);
    });

    it('should throw BadRequestException if event already exists', async () => {
      const body = { eventName: 'Wedding' };
      event.eventName = body.eventName;

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(event); // Mock event already exists

      await expect(service.createEvent(body)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on save error', async () => {
      const body = { eventName: 'Wedding' };

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(null); // Mock event not found
      jest.spyOn(eventRepo, 'save').mockRejectedValue(new Error('Save error')); // Mock save error

      await expect(service.createEvent(body)).rejects.toThrow(BadRequestException);
    });
  });

});
