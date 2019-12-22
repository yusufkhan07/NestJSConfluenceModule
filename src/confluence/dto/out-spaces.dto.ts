import { OutSpaceDto } from '..';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PaginationLinks {
  @ApiPropertyOptional()
  @Expose()
  next: string;

  @ApiPropertyOptional()
  @Expose()
  prev: string;
}

export class OutSpacesDto {
  @Type(() => OutSpaceDto)
  @ApiProperty({
    type: OutSpaceDto,
    isArray: true,
  })
  @Expose()
  results: OutSpaceDto[];

  @ApiProperty()
  @Expose()
  start: number;

  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  size: number;

  @Type(() => PaginationLinks)
  @ApiProperty({
    type: PaginationLinks,
  })
  @Expose()
  _links: PaginationLinks;
}
