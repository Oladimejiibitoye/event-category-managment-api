import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends SharedEntity {
  @Column({ unique: true })
  categoryName: string;

  @Column({ nullable: true})
  parentId: string;
}

