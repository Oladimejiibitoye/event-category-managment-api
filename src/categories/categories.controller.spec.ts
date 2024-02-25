import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Event } from '../entities/event.entity';
import { AppDataSource } from '../../ormconfig';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TypeOrmModule.forFeature([Category, Event])],
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    categoriesController = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService)
  });

  describe('addCategory', () => {
    it('should add category', async () => {
      const body = { categoryName: 'New Category', parentId: 'parentCategoryId' };
      const result = Promise.resolve({        
        "categoryName": "New Category",
        "parentId": "parentCategoryId",
        "updatedOn": null,
        "id": "a59c1a73-90ca-4f1e-915f-4692cbc0b1aa",
        "createdOn": "2024-02-25T09:51:01.456Z",
        "deletedOn": null
      })
      jest.spyOn(categoriesService, 'addCategory').mockImplementation(() => result);

      expect(await categoriesController.addCategory(body)).toBe(result);
    });
  });
});
