import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string

  @IsUUID()
  parentId: string
}
