import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Event } from 'src/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Event])],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
