import {   
  BadRequestException,
  Injectable,
  NotFoundException,  } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { ZaLaResponse } from '../common/helpers/response';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>
  ) {}

  async addCategory(body: CreateCategoryDto): Promise<{}> {
    try {
      const categoryExist = await this.categoryRepo.findOne({
        where: {
          categoryName: body.categoryName,
          parentId: body.parentId
        }
      })
      if(categoryExist){
        throw new BadRequestException(
          ZaLaResponse.BadRequest(
            'Bad Request',
            `A category with ${body.categoryName} already exists`,
          ),
        );
      }

      const parentCategoryExist = await this.categoryRepo.findOne({
        where: {id: body.parentId}
      })

      if(!parentCategoryExist){
        const eventExist = await this.eventRepo.findOne({
          where: {id: body.parentId}
        })
        if(!eventExist){
          throw new BadRequestException(
            ZaLaResponse.BadRequest(
              'Bad Request',
              `A parent with ${body.parentId} does not exists`,
            ),
          );
        }
      }

      const category = await this.categoryRepo.save({
        ...body
      })
      return category
    } catch (error) {
      throw new BadRequestException(
        ZaLaResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async fetchSubTreeByParentId(parentId: string) {
    try {
      const subTree = await this.categoryRepo.find({
        where: {parentId}
      })
      return subTree
    } catch (error) {
      throw new BadRequestException(
        ZaLaResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }


  async moveSubTreeByParentId(categoryId: string, parentId: string) {
    try {
      const categoryExist = await this.categoryRepo.findOne({
        where: {id: categoryId}
      })
      if(!categoryExist){
        throw new NotFoundException(
          ZaLaResponse.NotFoundRequest(
            'Not Found',
            'Category does not exist',
            '404',
          ),
        );
      }
  
      const parentCategoryExist = await this.categoryRepo.findOne({
        where: {id: parentId}
      })
  
      if(!parentCategoryExist){
        throw new NotFoundException(
          ZaLaResponse.NotFoundRequest(
            'Not Found',
            'Parent Category does not exist',
            '404',
          ),
        );
      }
  
      const updatedCategory = await this.categoryRepo.update(categoryId, {parentId});
  
      return updatedCategory
    } catch (error) {
      throw new BadRequestException(
        ZaLaResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async removeCategory(categoryId: string) {
    try {
      const categoryExist = await this.categoryRepo.findOne({
        where: {id: categoryId}
      })
      if(!categoryExist){
        throw new NotFoundException(
          ZaLaResponse.NotFoundRequest(
            'Not Found',
            'Category does not exist',
            '404',
          ),
        );
      }

      await this.categoryRepo.delete(categoryId)
      await this.categoryRepo.delete({parentId: categoryExist.parentId})
      return null
    } catch (error) {
      throw new BadRequestException(
        ZaLaResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }
}
