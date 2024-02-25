import {
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
    DeleteDateColumn,
  } from 'typeorm';
  
  export abstract class SharedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
  
    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedOn?: Date;
  
    @Column({ nullable: true, type: 'timestamp' })
    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedOn?: Date;
  
    @BeforeUpdate()
    updateDates() {
      this.updatedOn = new Date();
    }
  }
  