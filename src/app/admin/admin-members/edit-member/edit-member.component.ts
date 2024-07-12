import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthanticationService } from '../../services/authantication.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
})
export class EditMemberComponent implements OnInit {
  allRoles: any;
  myForm: FormGroup;
  errormessage: string = '';
  memberData: any;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
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

    const memberId = this.route.snapshot.paramMap.get('id');
    this.roleService.getMemberById(memberId).subscribe((res: any) => {
      this.memberData = res.data.user;
      console.log(this.memberData);
    });
  }

  onSubmit() {
    const body = this.myForm.value;
    this.roleService.updateUser('editUser', body).subscribe(
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
