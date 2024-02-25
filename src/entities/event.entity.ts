import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Event extends SharedEntity {
  @Column({ unique: true })
  eventName: string;
}
