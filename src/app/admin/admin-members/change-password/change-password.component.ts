import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthanticationService } from '../../services/authantication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  LoginForm: FormGroup;
  errormessage: string = '';

  constructor(
    private formB: FormBuilder,
    private router: Router,
    private authService: AuthanticationService
  ) {
    this.LoginForm = this.formB.group({
      password1: ['', [Validators.required]],
      password2: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password1 = formGroup.get('password1')?.value;
    const password2 = formGroup.get('password2')?.value;
    return password1 === password2 ? null : { passwordMismatch: true };
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

  hiddenPassword1: boolean = true;
  hiddenPassword2: boolean = true;
  typePassword1: string = 'password';
  typePassword2: string = 'password';

  showPassword(field: string) {
    if (field === 'password1') {
      this.hiddenPassword1 = false;
      this.typePassword1 = 'text';
    } else if (field === 'password2') {
      this.hiddenPassword2 = false;
      this.typePassword2 = 'text';
    }
  }

  hidePassword(field: string) {
    if (field === 'password1') {
      this.hiddenPassword1 = true;
      this.typePassword1 = 'password';
    } else if (field === 'password2') {
      this.hiddenPassword2 = true;
      this.typePassword2 = 'password';
    }
  }
}
