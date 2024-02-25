import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Event } from '../entities/event.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepo: Repository<Category>;
  let eventRepo: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository, // Mock category repository for testing
        },
        {
          provide: getRepositoryToken(Event),
          useClass: Repository, // Mock event repository for testing
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepo = module.get<Repository<Category>>(getRepositoryToken(Category));
    eventRepo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  const body = { categoryName: 'New Category', parentId: 'parentCategoryId' };
  const category = new Category()
  category.categoryName = body.categoryName;
  category.parentId = body.parentId

  const event = new Event();
  const eventBody = { eventName: 'Wedding' };
  event.eventName = eventBody.eventName;

  describe('addCategory', () => {
    it('should add a category', async () => {

      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(null); // Mock category not found
      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(event);
      jest.spyOn(categoryRepo, 'save').mockResolvedValue(category); // Mock save operation

      expect(await service.addCategory(body)).toEqual(category);
    });

    it('should throw BadRequestException if category already exists', async () => {

      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(category); // Mock category already exists

      await expect(service.addCategory(body)).rejects.toThrow(BadRequestException);
    });

    // Add more test cases for other scenarios as needed
  });

  describe('fetchSubTreeByParentId', () => {
    it('should fetch sub tree by parent id', async () => {
      const parentId = 'parentCategoryId';
      const subTree = [{ id: '1', categoryName: 'Sub Category 1', parentId }] as Category[];

      jest.spyOn(categoryRepo, 'find').mockResolvedValue(subTree); // Mock sub tree

      expect(await service.fetchSubTreeByParentId(parentId)).toEqual(subTree);
    });

    it('should throw BadRequestException on error', async () => {
      const parentId = 'parentCategoryId';

      jest.spyOn(categoryRepo, 'find').mockRejectedValue(new Error('Error fetching sub tree'));

      await expect(service.fetchSubTreeByParentId(parentId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('moveSubTreeByParentId', () => {
    // it('should move sub tree by parent id', async () => {
    //   const categoryId = 'categoryId';
    //   const parentId = 'parentCategoryId';
    //   const updatedCategory = { id: categoryId, parentId };

    //   jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(category); // Mock category found
    //   jest.spyOn(categoryRepo, 'update').mockResolvedValue(updatedCategory); // Mock update operation

    //   expect(await service.moveSubTreeByParentId(categoryId, parentId)).toEqual(updatedCategory);
    // });

    it('should throw BadRequestException if category does not exist', async () => {
      const categoryId = 'nonExistingCategoryId';
      const parentId = 'parentCategoryId';

      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(null); // Mock category not found

      await expect(service.moveSubTreeByParentId(categoryId, parentId)).rejects.toThrow(BadRequestException);
    });

    // Add more test cases for other scenarios as needed
  });

  describe('removeCategory', () => {
    it('should remove category and its children', async () => {
      const categoryId = 'categoryId';
      const categoryExist = { id: categoryId, parentId: 'parentCategoryId' } as Category;

      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(categoryExist); // Mock category found
      jest.spyOn(categoryRepo, 'delete').mockResolvedValue(null); // Mock delete operation

      await expect(service.removeCategory(categoryId)).resolves.toBeFalsy();
    });

    it('should throw BadRequestException if category does not exist', async () => {
      const categoryId = 'nonExistingCategoryId';

      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(null); // Mock category not found

      await expect(service.removeCategory(categoryId)).rejects.toThrow(BadRequestException);
    });

  })
});
