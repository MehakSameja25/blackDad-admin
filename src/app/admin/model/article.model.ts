import { BaseModel } from './base.model';
import { Category } from './category.model';

export class Article extends BaseModel {
  data!: [
    {
      id: number;
      name: string;
      description: string;
      image: string;
      thumbnail: string;
      isBlock: string;
      isPublished: string;
      isApproved: string;
      reason: string;
      meta_title: null;
      meta_description: string;
      meta_url: null;
      slug: string;
      date: string;
      url: null;
      categoryId: string;
      country: null;
      timezone: null;
      publish_date: null;
      is_scheduled: string;
      userId: number;
      category: Category;
    }
  ];
}
export class SingleArticle extends BaseModel {
  id!: number;
  name!: string;
  description!: string;
  image!: string;
  thumbnail!: string;
  isBlock!: string;
  isPublished!: string;
  isApproved!: string;
  reason!: string;
  meta_title!: null;
  meta_description!: string;
  meta_url!: null;
  slug!: string;
  date!: string;
  url!: null;
  categoryId!: string;
  country!: null;
  timezone!: null;
  publish_date!: null;
  is_scheduled!: string;
  userId!: number;
  category!: Category;
}
