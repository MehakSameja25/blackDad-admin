import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ManufacturerRolesService } from 'src/app/admin/services/manufacturer-roles.service';
import { RoleService } from 'src/app/admin/services/role.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  menuData: { id: number; name: string }[] = [];
  roleData: any = {
    name: '',
    role: [],
    isManufacturer: true,
  };
  roleId!: string;

  constructor(
    private roleService: ManufacturerRolesService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.roleId = params['id'];
        this.roleService.get(this.roleId).subscribe((res) => {
          if (res && res.data) {
            this.roleData.name = res.data.name;
            res.data.role_accesses.forEach(
              (data: { id: number; menu_id: number; status: string }) => {
                this.roleData.role.push({
                  id: data.id,
                  menu_id: data.menu_id,
                  status: data.status,
                });
              }
            );
          }
        });
      }
    });
  }

  isStatusExit(id: number, status: string) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id === id
    );
    return role ? role.status?.includes(status) : false;
  }

  isRoleExit(id: number) {
    return this.roleData.role.some(
      (data: { menu_id: number }) => data.menu_id === id
    );
  }

  ngOnInit(): void {
    // Static menu data
    this.menuData = [{ id: 4, name: 'Manufacturer' }];
  }

  addMenu(id: number, event: any) {
    if (event.checked) {
      this.roleData.role.push({ menu_id: id });
    } else {
      const role = this.roleData.role.find(
        (data: { menu_id: number }) => data.menu_id === id
      );
      if (role) {
        this.roleData.role.splice(this.roleData.role.indexOf(role), 1);
      }
    }
  }

  addMenuAccess(id: number, event: any, status: string) {
    const role = this.roleData.role.find(
      (data: { menu_id: number }) => data.menu_id === id
    );
    if (event.checked) {
      if (role) {
        if (!role.status) {
          role.status = [];
        }
        role.status.push(status);
      }
    } else {
      if (role?.status) {
        const index = role.status.indexOf(status);
        if (index > -1) {
          role.status.splice(index, 1);
        }
      }
    }
  }

  isMenuExist(id: number) {
    return !this.roleData.role.some(
      (data: { menu_id: number }) => data.menu_id === id
    );
  }

  addRole() {
    if (!this.roleData.name || this.roleData.name.trim().length < 5) {
      this.notifications.error(
        'Error',
        'Role name must have a minimum of 5 characters.'
      );
      return;
    }

    const roleAction = this.roleId
      ? this.roleService.edit(this.roleData, +this.roleId)
      : this.roleService.add(this.roleData);

    roleAction.subscribe(() => {
      this.router.navigate(['/admin/manufecturer/roles']);
    });
  }
}
