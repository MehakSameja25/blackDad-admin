import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthanticationService } from '../services/authantication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent {
  updateForm!: FormGroup;
  UserId: any;
  userDetails: any;
  successMessage: string = '';
  successalertClass: string = 'd-none';
  userRole: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthanticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    this.UserId = localStorage.getItem('userId');
    this.authService.getUserById(this.UserId).subscribe((res: any) => {
      if (res) {
        this.userDetails = res.data;
        this.userRole = res.data.role.name;
        // console.log(this.userRole, 'ROLES');
      }
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const body = {
        name: this.updateForm.value.name,
        email: this.updateForm.value.email,
        password: this.updateForm.value.password,
        type: 'editUser',
      };
      this.updateApiCall(body);
    } else {
      console.log('Form is invalid.');
      this.updateForm.markAllAsTouched();
    }
  }

  updateApiCall(data: any) {
    this.authService.updateProfile(data).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.successMessage = 'Profile Updated';
          this.successalertClass = '';
        }, 1000);
        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
          localStorage.removeItem('nkt');
          this.router.navigate(['/admin-auth']);
        }, 2000);
      }
    });
  }
  show: any = false;
  hidden: any = true;
  type: any = 'password';

  showPassword() {
    this.show = true;
    this.hidden = false;
    this.type = 'text';
  }

  hidePassword() {
    this.hidden = true;
    this.show = false;
    this.type = 'password';
  }
}
