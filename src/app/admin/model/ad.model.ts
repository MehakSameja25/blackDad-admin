export class Advertisement {
  'data': [
    {
      id: number | null;
      title: string;
      description: string;
      image: string;
      url: string;
      isBlock: string;
      clicks: number;
      page: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: null | string;
    }
  ];
}
export class SingleAdvertisement {
  'data': {
    id: number | null;
    title: string;
    description: string;
    image: string;
    url: string;
    isBlock: string;
    clicks: number;
    page: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: null | string;
  };
}
