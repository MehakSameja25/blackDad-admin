import { Component } from '@angular/core';
import { MainNavService } from '../../services/main-nav.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css'],
})
export class AddNewRoleComponent {
  menuData: { id: number, name: string }[] = [];
  roleData: any = {
    name: '',
    role: [],
  };
  categoriesChecked: boolean = false;
  permissions: any = {
    add: false,
    edit: false,
    delete: false,
  };
  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.menuData.push({ id: 1, name: 'Categories' });
    this.menuData.push({ id: 2, name: 'Episode' });
    this.menuData.push({ id: 3, name: 'Artical' });
  }

  onSubmit() {

  }

  addMenu(id: number, event: any) {
    if (event.checked) {
      this.roleData.role.push({ menuId: id });
    } else {
      const role = this.roleData.role.find((data: { menuId: number }) => data.menuId == id);
      if (role) {
        this.roleData.role.splice(this.roleData.role.indexOf(role), 1);
      }
    }
    console.log(this.roleData.role, "erty----------")
  }

  addMenuAccess(id: number, event: any, status: string) {
    const role = this.roleData.role.find((data: { menuId: number }) => data.menuId == id);
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
    const role = this.roleData.role.find((data: { menuId: number }) => data.menuId == id);
    if (role) {
      return false;
    }
    return true;
  }

  addRole() {
    this.roleService.addRole(this.roleData).subscribe(res => {
      console.log(res)
    })
  }
}
