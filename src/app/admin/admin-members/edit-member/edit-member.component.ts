import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthanticationService } from '../../services/authantication.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
})
export class EditMemberComponent implements OnInit {
  allRoles: any;
  myForm: FormGroup;
  errormessage: string = '';
  memberData: any;
  memberId!: string | null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationsService
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

    this.memberId = this.route.snapshot.paramMap.get('id');
    this.roleService.getMemberById(this.memberId).subscribe((res: any) => {
      this.memberData = res.data.user;
      console.log(this.memberData);
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.notificationService.error("Form is invalid")
      this.markFormGroupTouched(this.myForm);
    } else {
      const body = this.myForm.value;
      this.roleService.updateUser('editUserByAdmin', this.memberId, body).subscribe(
        (res) => {
          console.log(res);
          if (res) {
            this.myForm.reset();
            this.router.navigate(['/admin/all-members']);
          }
        },
      );
    }

  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
