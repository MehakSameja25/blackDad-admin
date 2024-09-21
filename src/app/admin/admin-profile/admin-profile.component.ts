import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthanticationService } from '../services/authantication.service';
import { Router } from '@angular/router';
import { MainUser, User } from '../model/user.model';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent {
  updateForm!: FormGroup;
  UserId!: string | null;
  userDetails!: any;
  // successMessage: string = '';
  // successalertClass: string = 'd-none';
  userRole!: any;

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
    this.authService.getUserById(this.UserId).subscribe((res) => {
      if (res) {
        this.userDetails = res.data;
        this.userRole = res.data?.role?.name;
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
      this.updateForm.markAllAsTouched();
    }
  }

  updateApiCall(data: {
    name: string;
    email: string;
    password: string;
    type: string;
  }) {
    this.authService.updateProfile(data).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          localStorage.removeItem('nkt');
          this.router.navigate(['/admin-auth']);
        }, 2000);
      }
    });
  }

  type: string = 'password';
  type2: string = 'password';
  showToggle(): void {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  showPassword2(): void {
    if (this.type2 === 'password') {
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }
}
