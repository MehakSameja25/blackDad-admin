import { BaseModel } from './base.model';

export class Category extends BaseModel {
  data!: [
    {
      id: number;
      name: string;
      image: string;
      isblock: string;
      description: string;
    }
  ];
}
