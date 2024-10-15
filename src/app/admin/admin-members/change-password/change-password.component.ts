import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthanticationService } from '../../services/authantication.service';
import { RoleService } from '../../services/role.service';
import { param } from 'jquery';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [],
})
export class ChangePasswordComponent {
  LoginForm: FormGroup;
  errormessage: string = '';
  proof: string | null;
  constructor(
    private formB: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) {
    this.LoginForm = this.formB.group(
      {
        password: ['', [Validators.required, this.passwordValidator]],
        password2: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );

    this.proof = this.route.snapshot.queryParamMap.get('proof');
  }

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const valid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength;
    return valid ? null : { passwordInvalid: true };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password1 = formGroup.get('password')?.value;
    const password2 = formGroup.get('password2')?.value;
    return password1 === password2 ? null : { passwordMismatch: true };
  }

  updateUser() {
    localStorage.clear();
    const authData = this.LoginForm.value;
    console.log('FORM DATA :=>', authData);
    if (this.proof) {
      this.roleService.updatePassword(this.proof, authData).subscribe(
        (res) => {
          if (res) {
            this.router.navigate(['/admin-auth']);
          }
        },
        (error) => {
          this.errormessage = error.error.message;
        }
      );
    }
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
