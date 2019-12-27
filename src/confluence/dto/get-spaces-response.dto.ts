class PaginationLinks {
  next: string;

  prev: string;
}

class SpaceDto {
  id: number;

  key: string;

  name: string;

  type: string;

  status: string;
}

export class GetSpacesResponseDto {
  results: SpaceDto[];

  start: number;

  limit: number;

  size: number;

  _links: PaginationLinks;
}
