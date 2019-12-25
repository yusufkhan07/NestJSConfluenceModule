import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

export class PageBodyItem {
  @ApiProperty()
  title: string;

  @ApiProperty()
  image: string;

  @ApiProperty({ type: String, isArray: true })
  items: string[];
}

export class PageBodyDto {
  @ApiProperty()
  logo: string;

  @ApiProperty({
    type: String,
  })
  date: string;

  @ApiProperty({})
  percentage: number;

  @Type(() => PageBodyItem)
  @ApiProperty({
    type: PageBodyItem,
    isArray: true,
  })
  data: PageBodyItem[];
}

export class CreatePageDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  spaceKey: string;

  @ApiProperty({ type: PageBodyDto })
  @Type(() => PageBodyDto)
  body: PageBodyDto;
}
