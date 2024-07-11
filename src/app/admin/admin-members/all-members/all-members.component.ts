import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.component.html',
})
export class AllMembersComponent implements OnInit {
  allMembers: any;
  deleteId: any;
  successalertClass: any = 'd-none';
  successMessage: any = '';

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.roleService.getMember().subscribe((response) => {
      this.allMembers = response;
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
  deleteMember(id: any) {
    this.roleService.delteMember(id).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.successMessage = 'Member Deleted!';
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
  UpdateMember(id: any) {
    console.log(id, 'edit');
  }
}
