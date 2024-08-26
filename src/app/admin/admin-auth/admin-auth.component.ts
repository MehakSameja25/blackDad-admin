import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthanticationService } from '../services/authantication.service';
import { Authantication } from '../model/login.model';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
})
export class AdminAuthComponent implements OnInit {
  LoginForm: FormGroup;
  errormessage: string = '';

  ngOnInit(): void {
    const isLogin = localStorage.getItem('nkt');
    // console.log('isLogin -------', isLogin);
    if (isLogin != null) {
      this.router.navigate(['/admin/profile']);
    }
  }

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
      (res: Authantication) => {
        if (res) {
          localStorage.setItem('nkt', res.data.token);
          setTimeout(() => {
            this.router.navigate(['/admin/profile']);
          }, 2000);
        }
      },
      (error) => {
        this.errormessage = error.error.message;
      }
    );
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
}
