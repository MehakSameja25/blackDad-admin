import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.component.html',
})
export class AllMembersComponent implements OnInit {
  allMembers: any;
  deleteId: any;
  // successalertClass: any = 'd-none';
  // successMessage: any = '';

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router
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
  tableColumns = [
    { title: 'Name' },
    { title: 'Email' },
    { title: 'Role' },
    { title: 'Access' },
    { title: 'Action' },
  ];
  tableData = [];

  @ViewChild('dataTable', { static: false }) table!: ElementRef;

  getMembers() {
    this.roleService.getMember().subscribe((response) => {
      this.allMembers = response;
      this.tableData = response.data.map((item: any) => [
        item.name,
        item.email,
        item.roles.map((role: any) => role.roletype.name),
        ` <ul>
        ${item.roles
          .map((role: any) =>
            role.roletype.role_accesses
              .map((access: any) => `<li>${access.status}</li>`)
              .join('')
          )
          .join('')}
      </ul>`,
        `<div class="actions d-flex align-items-center gap-2">
                          <a
                            class="btn-action-icon"
                            data-id="${item.id}" data-action="edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 401.523 401"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M370.59 250.973c-5.524 0-10 4.476-10 10v88.789c-.02 16.562-13.438 29.984-30 30H50c-16.563-.016-29.98-13.438-30-30V89.172c.02-16.559 13.438-29.98 30-30h88.79c5.523 0 10-4.477 10-10 0-5.52-4.477-10-10-10H50c-27.602.031-49.969 22.398-50 50v260.594c.031 27.601 22.398 49.968 50 50h280.59c27.601-.032 49.969-22.399 50-50v-88.793c0-5.524-4.477-10-10-10zm0 0"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <path
                                  d="M376.629 13.441c-17.574-17.574-46.067-17.574-63.64 0L134.581 191.848a9.997 9.997 0 0 0-2.566 4.402l-23.461 84.7a9.997 9.997 0 0 0 12.304 12.308l84.7-23.465a9.997 9.997 0 0 0 4.402-2.566l178.402-178.41c17.547-17.587 17.547-46.055 0-63.641zM156.37 198.348 302.383 52.332l47.09 47.09-146.016 146.016zm-9.406 18.875 37.62 37.625-52.038 14.418zM374.223 74.676 363.617 85.28l-47.094-47.094 10.61-10.605c9.762-9.762 25.59-9.762 35.351 0l11.739 11.734c9.746 9.774 9.746 25.59 0 35.36zm0 0"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
                          </a>
                          <a
                            (click)="open(password, member.id)"
                            class="btn-action-icon"
                            data-id="${item.id}" data-action="editPass"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 512 512"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M334.974 0c-95.419 0-173.049 77.63-173.049 173.049 0 21.213 3.769 41.827 11.211 61.403L7.672 399.928a12.613 12.613 0 0 0-3.694 8.917v90.544c0 6.965 5.646 12.611 12.611 12.611h74.616a12.61 12.61 0 0 0 8.91-3.686l25.145-25.107a12.61 12.61 0 0 0 3.701-8.925v-30.876h30.837c6.965 0 12.611-5.646 12.611-12.611v-12.36h12.361c6.964 0 12.611-5.646 12.611-12.611v-27.136h27.136c3.344 0 6.551-1.329 8.917-3.694l40.121-40.121c19.579 7.449 40.196 11.223 61.417 11.223 95.419 0 173.049-77.63 173.049-173.049C508.022 77.63 430.393 0 334.974 0zm0 320.874c-20.642 0-40.606-4.169-59.339-12.393-4.844-2.126-10.299-.956-13.871 2.525-.039.037-.077.067-.115.106l-42.354 42.354h-34.523c-6.965 0-12.611 5.646-12.611 12.611v27.136H159.8c-6.964 0-12.611 5.646-12.611 12.611v12.36h-30.838c-6.964 0-12.611 5.646-12.611 12.611v38.257l-17.753 17.725H29.202v-17.821l154.141-154.14c4.433-4.433 4.433-11.619 0-16.051s-11.617-4.434-16.053 0L29.202 436.854V414.07l167.696-167.708c.038-.038.067-.073.102-.11 3.482-3.569 4.656-9.024 2.53-13.872-8.216-18.732-12.38-38.695-12.38-59.33 0-81.512 66.315-147.827 147.827-147.827S482.802 91.537 482.802 173.05c-.002 81.51-66.318 147.824-147.828 147.824z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <path
                                  d="M387.638 73.144c-26.047 0-47.237 21.19-47.237 47.237s21.19 47.237 47.237 47.237 47.237-21.19 47.237-47.237-21.189-47.237-47.237-47.237zm0 69.252c-12.139 0-22.015-9.876-22.015-22.015s9.876-22.015 22.015-22.015 22.015 9.876 22.015 22.015-9.876 22.015-22.015 22.015z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
                          </a>
                          <a
                            class="btn-action-icon"
                            (click)="open(deletee, member.id)"
                            data-id="${item.id}" data-action="open"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 512 512"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                            >
                              <g>
                                <path
                                  d="M436 60h-75V45c0-24.813-20.187-45-45-45H196c-24.813 0-45 20.187-45 45v15H76c-24.813 0-45 20.187-45 45 0 19.928 13.025 36.861 31.005 42.761L88.76 470.736C90.687 493.875 110.385 512 133.604 512h244.792c23.22 0 42.918-18.125 44.846-41.271l26.753-322.969C467.975 141.861 481 124.928 481 105c0-24.813-20.187-45-45-45zM181 45c0-8.271 6.729-15 15-15h120c8.271 0 15 6.729 15 15v15H181V45zm212.344 423.246c-.643 7.712-7.208 13.754-14.948 13.754H133.604c-7.739 0-14.305-6.042-14.946-13.747L92.294 150h327.412l-26.362 318.246zM436 120H76c-8.271 0-15-6.729-15-15s6.729-15 15-15h360c8.271 0 15 6.729 15 15s-6.729 15-15 15z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                                <path
                                  d="m195.971 436.071-15-242c-.513-8.269-7.67-14.558-15.899-14.043-8.269.513-14.556 7.631-14.044 15.899l15 242.001c.493 7.953 7.097 14.072 14.957 14.072 8.687 0 15.519-7.316 14.986-15.929zM256 180c-8.284 0-15 6.716-15 15v242c0 8.284 6.716 15 15 15s15-6.716 15-15V195c0-8.284-6.716-15-15-15zM346.927 180.029c-8.25-.513-15.387 5.774-15.899 14.043l-15 242c-.511 8.268 5.776 15.386 14.044 15.899 8.273.512 15.387-5.778 15.899-14.043l15-242c.512-8.269-5.775-15.387-14.044-15.899z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                              </g>
                            </svg>
                          </a>
                        </div>`,
      ]);

      setTimeout(() => this.bindEvents(), 0);
    });
  }

  @ViewChild('deletee')
  public deleteModel!: ElementRef;

  @ViewChild('password')
  public passwordModel!: ElementRef;

  bindEvents(): void {
    const tableElement = this.table.nativeElement;
    const actionButtons = tableElement.querySelectorAll(
      '.btn-action-icon, .btn-danger'
    );

    actionButtons.forEach((button: HTMLElement) => {
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      switch (action) {
        case 'open':
          this.renderer.listen(button, 'click', () =>
            this.open(this.deleteModel, id)
          );
          break;
        case 'edit':
          this.renderer.listen(button, 'click', () => this.toEdit(id));
          break;
        case 'editPass':
          this.renderer.listen(button, 'click', () =>
            this.open(this.passwordModel, id)
          );
          break;
      }
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
        this.getMembers();
        this.modalService.dismissAll();
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
      this.roleService
        .updateUser('editPasswordByAdmin', this.deleteId, body)
        .subscribe((res) => {
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
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
  toEdit(id: any) {
    this.router.navigate([`/admin/edit-member/${id}`]);
  }
}
