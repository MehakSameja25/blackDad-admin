import { BaseModel } from './base.model';
import { Category } from './category.model';

export class Article extends BaseModel {
  data!: [
    {
      id: number | string;
      name: string;
      description: string;
      image: string;
      thumbnail: string;
      isBlock: string;
      isPublished: string;
      isApproved: string;
      reason: string;
      meta_title: null | string;
      meta_description: string;
      meta_url: null | string;
      slug: string;
      date: string;
      url: null | string;
      categoryId: string;
      country: null | string;
      timezone: null | string;
      publish_date: null | string;
      is_scheduled: string;
      userId: number;
      category: Category;
    }
  ];
}
export class SingleArticle {
  'data': {
    id: string;
    name: string;
    description: string;
    image: string;
    thumbnail: string;
    isBlock: string;
    isPublished: string;
    isApproved: string;
    reason: string;
    meta_title: null | string;
    meta_description: string;
    meta_url: null | string;
    slug: string;
    date: string;
    url: null | string;
    categoryId: string | any;
    country: null | string;
    timezone: null | string;
    publish_date: null | string;
    is_scheduled: string;
    userId: number;
    category: Category;
    categories: [
      {
        id: number;
        name: string;
        image: string;
        isblock: string;
        description: string;
        created_at: string;
        updated_at: string;
      }
    ];
  };
}

export class Draft {
  'data': [
    {
      id: number;
      draft: {
        name: string | null;
        type: string | null;
        categoryId: string | null | any;
        description: string | null;
        filetype: string | null;
        meta_description: string | null;
        subtype: string | null;
        episodeNo: string | null;
        seasonNo: string | null;
        slug: string | null;
        reason: string | null;
        url: string | null;
        isBlock: string | null;
        isApproved: string | null;
        isPublished: string | null;
        isDraft: string | null;
      };
      type: string | null;
      thumbnail: string | null;
      image: string | null;
      file: string | null;
      created_at: string | null;
      updated_at: string | null;
      deleted_at: string | null;
      userId: number;
      category: [];
    }
  ];
}

export class SingleDraft {
  data!: {
    id: number;
    draft: {
      name: string | null;
      type: string | null;
      categoryId: string | null | any;
      description: string | null;
      filetype: string | null;
      meta_description: string | null;
      subtype: string | null;
      episodeNo: string | null;
      seasonNo: string | null;
      slug: string | null;
      reason: string | null;
      url: string | null;
      isBlock: string | null;
      isApproved: string | null;
      isPublished: string | null;
      isDraft: string | null;
    };
    type: string | null;
    thumbnail: string;
    image: string;
    file: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    userId: number;
    category: any ;
  };
}
