export class SingleMeta {
  'data': {
    created_at: string;
    id: number | null;
    meta_description: string;
    meta_for: string;
    updated_at: string;
  };
}

export class MetaList {
  'data': [
    {
      created_at: string;
      id: number | null;
      meta_description: string;
      meta_for: string;
      updated_at: string;
    }
  ];
}
