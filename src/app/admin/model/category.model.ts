import { BaseModel } from './base.model';

export class Category extends BaseModel {
  'data': [
    {
      id: number | null;
      name: string;
      image: string;
      isblock: string;
      description: string;
    }
  ];
}

export class SingleCategory extends BaseModel {
  'data': {
    id: number | null | string;
    name: string;
    image: string;
    isblock: string;
    description: string;
  };
}
