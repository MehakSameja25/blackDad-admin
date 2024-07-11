import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  allRoles: any;
  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      this.allRoles = res.data;
    });
  }
}
