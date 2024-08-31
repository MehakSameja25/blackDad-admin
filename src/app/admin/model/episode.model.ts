import { Category } from './category.model';

export class Episode {
  'data': [
    {
      id: number | null | string;
      name: string;
      type: string;
      subtype: string;
      image: string;
      thumbnail: string;
      file: string;
      filetype: string;
      description: string;
      isBlock: string;
      isPublished: string;
      isApproved: string;
      reason: string;
      url: string;
      htmlcode: string;
      meta_description: string;
      episodeNo: number;
      seasonNo: number;
      slug: string;
      date: string;
      categoryId: string;
      country: null | string;
      timezone: null | string;
      publish_date: null | string;
      is_scheduled: string;
      created_at: string;
      updated_at: string;
      deleted_at: null | string;
      userId: number;
      category: [
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
    }
  ];
}

export class SingleEpisode {
  'data': {
    id: number | null | string;
    name: string;
    type: string;
    subtype: string;
    image: string;
    thumbnail: string;
    file: string;
    filetype: string;
    description: string;
    isBlock: string;
    isPublished: string;
    isApproved: string;
    reason: string;
    url: string;
    htmlcode: string;
    meta_description: string;
    episodeNo: number | string;
    seasonNo: number | string;
    slug: string;
    date: string;
    categoryId: string | any;
    country: null | string;
    timezone: null | string;
    publish_date: null | string;
    is_scheduled: string;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
    userId: number;
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
    category: [
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
