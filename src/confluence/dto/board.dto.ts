import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class RowDto {
  @ApiProperty()
  selected: boolean;

  @ApiProperty()
  text: string;

  @ApiProperty({
    example: '2019-12-14T17:58:33.724Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  createdAt: Date;
}

class RetroColumnDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    example: '2019-12-14T17:58:33.724Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: () => RowDto, isArray: true })
  @Type(() => RowDto)
  rows: RowDto[] = [];
}

export class BoardDto {
  @ApiProperty({ description: 'Week number', example: 'week 13' })
  name: string;

  @ApiProperty({
    description: 'percentage from 0 to 1',
  })
  participationRate: number = 0.1;

  @ApiProperty({
    example: '2019-12-14T17:58:33.724Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  createdAt: Date = new Date();

  @ApiProperty({ type: () => RowDto, isArray: true })
  @Type(() => RowDto)
  actionItems: RowDto[] = [];

  @ApiProperty({ type: () => RetroColumnDto, isArray: true })
  @Type(() => RetroColumnDto)
  columns: RetroColumnDto[] = [];
}
