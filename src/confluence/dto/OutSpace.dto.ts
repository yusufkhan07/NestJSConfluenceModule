import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OutSpaceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  status: string;
}
