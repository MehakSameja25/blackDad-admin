import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  allRoles: any;
  deleteId: any;
  successMessage!: string;
  successalertClass!: string;
  constructor(private roleService: RoleService, private modalService : NgbModal) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      this.allRoles = res.data;
    });
  }

  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
    console.log(id);
  }
  deleteRole(id: any) {
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
  }
}
