export class MemberListing {
  'data': [
    {
      id: number;
      name: string;
      email: string;
      roles: [
        {
          id: number;
          type: string;
          deleted_at: null;
          user_id: number;
          role_type_id: number;
          roletype: {
            id: number;
            name: string;
            deleted_at: string | null;
            role_accesses: [
              {
                id: number;
                status: string;
                menu_id: number;
                menu_bar: {
                  id: number;
                  title: string;
                  route: string;
                  icon: null;
                };
              },
              {
                id: number;
                status: string;
                menu_id: number;
                menu_bar: {
                  id: number;
                  title: string;
                  route: string;
                  icon: null;
                };
              },
              {
                id: number;
                status: string;
                menu_id: 1;
                menu_bar: {
                  id: number;
                  title: string;
                  route: string;
                  icon: null;
                };
              }
            ];
          };
        }
      ];
    }
  ];
}

export class RoleList {
  'data': {
    role: [
      {
        id: number;
        name: string;
        deleted_at: string | null;
        role_accesses: [
          {
            id: number;
            status: string;
            deleted_at: null;
            menu_id: number;
            role_type_id: number;
            menu_bar: {
              id: number;
              title: string;
              route: string;
              icon: null;
              is_parent: number;
              created_at: string;
              updated_at: string;
            };
          }
        ];
      }
    ];
  };
}
