import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-member',
  templateUrl: './add-new-member.component.html',
})
export class AddNewMemberComponent implements OnInit {
  allRoles: any;
  myForm: FormGroup;
  errormessage: string = '';

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // password: ['', Validators.required],
      // roleTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe((res: any) => {
      this.allRoles = res.data;
    });
  }

  onSubmit() {
    const body = this.myForm.value;
    this.roleService.addMember(body).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.myForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/all-members']);
          }, 1000);
        }
      },
      (error) => {
        this.errormessage = error.error.message;
        setTimeout(() => {
          this.errormessage = '';
        }, 5000);
      }
    );
  }
}
