export class Menu {
  'data': [
    {
      role_accesses: [
        {
          id: number;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: null | string;
          menu_id: number;
          role_type_id: number;
          menu_bar: {
            id: number;
            title: string;
            route: string;
            icon: string;
            is_parent: number;
            created_at: string;
            updated_at: string;
          };
        }
      ];
    }
  ];
}
