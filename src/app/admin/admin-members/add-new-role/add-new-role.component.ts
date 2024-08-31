import { Component } from '@angular/core';
import { MainNavService } from '../../services/main-nav.service';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css'],
})
export class AddNewRoleComponent {
  menuData: { id: number; name: string }[] = [];
  roleData: any = {
    name: '',
    role: [],
  };
  categoriesChecked: boolean = false;
  permissions: {
    add: boolean;
    edit: boolean;
    delete: boolean;
  } = {
    add: false,
    edit: false,
    delete: false,
  };
  roleId!: string;
  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.roleId = params['id'];
        this.roleService.getRoleWithId(this.roleId).subscribe((res) => {
          if (res && res.data) {
            this.roleData.name = res.data.name;
            res.data.role_accesses.map((data: { id: number; menu_id: number; status: string; }) => {
              this.roleData.role.push({
                id: data.id,
                menu_id: data.menu_id,
                status: JSON.parse(data.status),
              });
            });
          }
        });
      }
    });
  }

  isStatusExit(id: number, status: string) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id == id
    );
    if (role) {
      if (!role.status) {
        role.status = [];
      }
      const roleStatus = role.status.find((data: string) => data == status);
      if (roleStatus) {
        return true;
      }
    }
    return false;
  }

  isRoleExit(id: number) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id == id
    );
    if (role) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.menuData.push({ id: 1, name: 'Categories' });
    this.menuData.push({ id: 2, name: 'Episode' });
    this.menuData.push({ id: 3, name: 'Artical' });
  }

  addMenu(id: number, event: any) {
    if (event.checked) {
      this.roleData.role.push({ menu_id: id });
    } else {
      const role = this.roleData.role.find(
        (data: { menu_id: number }) => data.menu_id == id
      );
      if (role) {
        this.roleData.role.splice(this.roleData.role.indexOf(role), 1);
      }
    }
  }

  addMenuAccess(id: number, event: any, status: string) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id == id
    );
    if (event.checked) {
      if (role) {
        if (!role.status) {
          role.status = [];
        }
        role.status.push(status);
      }
    } else {
      if (role.status) {
        const roleStatus = role.status.find((data: string) => data == status);
        if (roleStatus) {
          role.status.splice(role.status.indexOf(roleStatus), 1);
        }
      }
    }
  }

  isMenuExist(id: number) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id == id
    );
    if (role) {
      return false;
    }
    return true;
  }

  addRole() {
    let role;
    if (this.roleId) {
      role = this.roleService.editRole(this.roleData, +this.roleId);
    } else {
      role = this.roleService.addRole(this.roleData);
    }
    role.subscribe((res) => {
      this.router.navigate(['/admin/role-type']);
    });
  }
}
