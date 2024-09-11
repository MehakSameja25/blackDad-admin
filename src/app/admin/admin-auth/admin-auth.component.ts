import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthanticationService } from '../services/authantication.service';
import { Authantication } from '../model/login.model';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
})
export class AdminAuthComponent implements OnInit {
  LoginForm: FormGroup;
  PasswordForm: FormGroup;
  errormessage: string = '';
  currentPage!: string;

  ngOnInit(): void {
    this.currentPage = this.router.url;
    const isLogin = localStorage.getItem('nkt');
    // console.log('isLogin -------', isLogin);
    if (isLogin != null) {
      this.router.navigate(['/admin/profile']);
    }
  }

  constructor(
    private formB: FormBuilder,
    private router: Router,
    private authService: AuthanticationService,
    private notify: NotificationsService
  ) {
    this.LoginForm = this.formB.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.PasswordForm = this.formB.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  AdminLogin() {
    if (this.LoginForm.invalid) {
      this.notify.alert('Form Invalid');
    } else {
      const authData = {
        email: this.LoginForm.value.email,
        password: this.LoginForm.value.password,
        userType : 'admin'
      };
      this.authService.AdminAuthantication(authData).subscribe(
        (res: Authantication) => {
          if (res) {
            localStorage.setItem('userId', res.data.user.id.toString());
            localStorage.setItem('nkt', res.data.token);
            this.router.navigate(['/admin/profile']);
          }
        },
        (error) => {
          this.errormessage = error.error.message;
        }
      );
    }
  }

  show: boolean = false;
  hidden: boolean = true;
  type: string = 'password';

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

  resetPassword() {
    if (this.PasswordForm.invalid) {
      this.notify.alert('Form Invalid');
    } else {
      const body = {
        email: this.PasswordForm.value.email,
      };
      this.authService.resetPassword(body).subscribe((res) => {
        if (res) {
          this.router.navigate(['/']);
        }
      });
    }
  }
}
