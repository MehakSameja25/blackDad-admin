import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
})
export class AssignRoleComponent implements OnInit {
  myForm!: FormGroup;
  allRoles: any;
  allMembers: any;
  successalertClass: any = 'd-none';
  errormessage: any;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      userId: ['', Validators.required],
      roleTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe((res: any) => {
      this.allRoles = res.data;
    });

    this.roleService.getMember().subscribe((res) => {
      this.allMembers = res;
    });
  }

  onsubmit() {
    this.roleService.assignRole([this.myForm.value]).subscribe(
      (response) => {
        if (response) {
          setTimeout(() => {
            this.router.navigate(['/admin/all-members']);
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
