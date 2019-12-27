import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class _OutPageLinks {
  webui: string;
}

class OutPageSpace {
  key: string;
}

export class OutPageDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  title: string;
}
