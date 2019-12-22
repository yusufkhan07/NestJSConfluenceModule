import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageBodyDto {}

export class CreatePageDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  spaceKey: string;

  @ApiProperty()
  @Type(() => PageBodyDto)
  body: PageBodyDto;
}
