import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.component.html',
})
export class AllMembersComponent implements OnInit {
  allMembers: any;
  deleteId: any;
  successalertClass: any = 'd-none';
  successMessage: any = '';

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        cnfPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.roleService.getMember().subscribe((response) => {
      this.allMembers = response;
    });
  }

  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
    console.log(id);
  }
  deleteMember(id: any) {
    this.roleService.delteMember(id).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.successMessage = 'Member Deleted!';
          this.successalertClass = '';
          this.ngOnInit();
          this.modalService.dismissAll();
        }, 1000);
        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    });
  }
  passwordForm: FormGroup;

  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const cnfPasswordControl = formGroup.get('cnfPassword');

    if (!newPasswordControl || !cnfPasswordControl) {
      return;
    }

    const newPassword = newPasswordControl.value;
    const cnfPassword = cnfPasswordControl.value;

    if (newPassword !== cnfPassword) {
      cnfPasswordControl.setErrors({ mismatch: true });
    } else {
      cnfPasswordControl.setErrors(null);
    }
  }
  checkClose() {
    this.passwordForm.reset();
    this.formInvalid = false;
    this.modalService.dismissAll();
  }

  formInvalid: boolean = false;
  onSubmit() {
    const body = {
      password: this.passwordForm.value.newPassword,
    };
    if (this.passwordForm.valid) {
      console.log('Form submitted with values:', body);
      this.roleService.updateUser('password', body).subscribe((res) => {
        console.log(res);
        this.checkClose();
      });
    } else {
      console.log('Form is invalid. Please fix errors.');
      this.formInvalid = true;
      this.validateAllFormFields(this.passwordForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control: any = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
