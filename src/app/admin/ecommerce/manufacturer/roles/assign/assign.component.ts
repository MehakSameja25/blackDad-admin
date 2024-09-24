import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleList, MemberListing } from 'src/app/admin/model/member.model';
import { ManufacturerRolesService } from 'src/app/admin/services/manufacturer-roles.service';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';
import { RoleService } from 'src/app/admin/services/role.service';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css'],
})
export class AssignComponent implements OnInit {
  myForm!: FormGroup;
  allRoles!: RoleList;
  allMembers!: any;
  successalertClass: string = 'd-none';
  errormessage!: string;

  constructor(
    private fb: FormBuilder,
    private roleService: ManufacturerRolesService,
    private manufecService: ManufacturersService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      userId: ['', Validators.required],
      roleTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.roleService.list().subscribe((res: RoleList) => {
      console.log(res);
      this.allRoles = res;
    });

    this.manufecService.list().subscribe((res: any) => {
      if (res) {
        this.allMembers = res.data?.mnufacturer;
      }
    });
  }

  onsubmit() {
    const body = {
      roleTypeId: this.myForm.value.roleTypeId,
      userId: this.myForm.value.userId,
      type: 'manufacturer',
    };
    this.roleService.assign([body]).subscribe(
      (response) => {
        if (response) {
          setTimeout(() => {
            this.router.navigate(['/manufacturers']);
          }, 1000);
        }
      },
      (error) => {
        this.successalertClass = '';
        this.errormessage = error.error.message;
        setTimeout(() => {
          this.errormessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    );
  }
}
