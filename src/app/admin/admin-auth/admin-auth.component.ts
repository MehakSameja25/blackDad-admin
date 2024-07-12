import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthanticationService } from '../services/authantication.service';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
})
export class AdminAuthComponent {
  LoginForm: FormGroup;
  errormessage: string = '';

  constructor(
    private formB: FormBuilder,
    private router: Router,
    private authService: AuthanticationService
  ) {
    this.LoginForm = this.formB.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  AdminLogin() {
    const authData = this.LoginForm.value;
    console.log('FORM DATA :=>', authData);
    this.authService.AdminAuthantication(authData).subscribe(
      (res: any) => {
        if (res) {
          localStorage.setItem('nkt', res.data.token);
          localStorage.setItem('userId', res.data.user.id);

          setTimeout(() => {
            this.router.navigate(['/admin/episodes']);
          }, 2000);
        }
      },
      (error) => {
        this.errormessage = error.error.message;
      }
    );
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
