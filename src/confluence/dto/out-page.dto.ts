class _OutPageLinks {
  webui: string;
}

class OutPageSpace {
  key: string;
}

export class OutPageDto {
  id: number;

  type: string;

  status: string;

  title: string;

  space: OutPageSpace;

  _links: _OutPageLinks;
}
