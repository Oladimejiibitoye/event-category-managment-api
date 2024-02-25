import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { AppDataSource } from '../../ormconfig';


describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TypeOrmModule.forFeature([Event])],
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('create', () => {
    it('should create', async () => {
      const body = {eventName: 'Wedding'};
      const result = Promise.resolve({        
        "eventName": "wedding event",
        "updatedOn": null,
        "id": "acca7c20-6308-4c01-9364-27a5fab2f1bf",
        "createdOn": "2024-02-25T09:47:50.183Z",
        "deletedOn": null
      })
      jest.spyOn(eventsService, 'createEvent').mockImplementation(() => result);

      expect(await eventsController.create(body)).toBe(result);
    });
  });
});
