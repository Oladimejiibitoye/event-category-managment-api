import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Ok, ZaLaResponse } from '../common/helpers/response';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/')
  async addCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.addCategory({...createCategoryDto, categoryName: createCategoryDto.categoryName.trim().toLowerCase()});
    return ZaLaResponse.Ok(category, 'Event created', 201);
  }

  @Get('/:parentId')
  async fetchSubTree( @Param('parentId', new ParseUUIDPipe()) parentId: string) {
    const subTrees = await this.categoriesService.fetchSubTreeByParentId(parentId);
    return ZaLaResponse.Ok(subTrees, 'Ok', 200);
  }

  @Patch('/:categoryId/:parentId')
  async moveSubtree(@Param('categoryId', new ParseUUIDPipe()) categoryId: string, @Param('parentId') parentId: string) {
    const subTree = await this.categoriesService.moveSubTreeByParentId(categoryId, parentId);
    return ZaLaResponse.Ok(subTree, 'Subtree moved successfully', 200);
  }

  @Delete('/:categoryId')
  async removeCategory(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    const category = await this.categoriesService.removeCategory(categoryId);
    return ZaLaResponse.Ok(category, 'Category deleted', 200);
  }
}
