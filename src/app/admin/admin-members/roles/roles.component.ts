import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  allRoles: any;
  filterRole: any;
  deleteId: any;
  allMembers: any;
  allChangeRoles: { userId: number, roleTypeId: number }[] = []
  successMessage!: string;
  successalertClass!: string;
  constructor(private roleService: RoleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      this.allRoles = res.data;
    });
  }

  open(content: any, id: any) {
    this.allChangeRoles = [];
    this.deleteId = id;
    this.filterRole = [...this.allRoles.role];
    const indexToRemove = this.filterRole.findIndex((role: { id: number }) => role.id === this.deleteId);
    if (indexToRemove !== -1) {
      this.filterRole.splice(indexToRemove, 1);
    }
    this.roleService.getMember().subscribe((res) => {
      this.allMembers = res.data.filter((data: any) => data.roles[0] && data.roles[0].role_type_id == this.deleteId);
      this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'share-modal',
      });
    });
  }

  changeRole(userId: number, roleId: string) {
    let addedUser = this.allChangeRoles.find(role => role.userId == userId);
    if (addedUser) {
      this.allChangeRoles.splice(this.allChangeRoles.indexOf(addedUser), 1);
    }
    this.allChangeRoles.push({ userId: userId, roleTypeId: +roleId });
  }

  allUserHaveRole() {
    if (!this.allMembers || !this.allChangeRoles) {
      return false;
    }
    for (const member of this.allMembers) {
      const memberUserId = member.id;
      if (!this.allChangeRoles.some(role => role.userId === memberUserId)) {
        return false;
      }
    }
    return true;
  }


  deleteRole(id: any) {
    this.roleService.assignRole(this.allChangeRoles).subscribe(res => {
      this.roleService.delteRole(id).subscribe((res) => {
        if (res) {
          setTimeout(() => {
            this.successMessage = 'Role Deleted!';
            this.successalertClass = '';
            this.ngOnInit();
            this.modalService.dismissAll();
          }, 1000);
          setTimeout(() => {
            this.successMessage = '';
            this.successalertClass = 'd-none';
          }, 5000);
        }
      });
    })
  }
}
