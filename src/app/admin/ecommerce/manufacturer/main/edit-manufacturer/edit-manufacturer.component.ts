import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';

@Component({
  selector: 'app-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.css'],
})
export class EditManufacturerComponent {
  manufacturerForm!: FormGroup;
  pageType!: string;
  manufecturer!: any;
  id!: string | null;

  constructor(
    private fb: FormBuilder,
    private _manufecturerService: ManufacturersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.manufacturerForm = this.fb.group({
      manufacturerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      companyName: ['', Validators.required],
      companyLicence: ['', Validators.required],
      aboutCompany: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.pageType = 'Update';
      this._manufecturerService.get(this.id).subscribe((res) => {
        if (res) {
          this.manufecturer = res;
          this.setFormValues();
        }
      });
    } else {
      this.pageType = 'Add';
    }
  }

  onSubmit(): void {
    const body = {
      email: this.manufacturerForm.value.email,
      phone: this.manufacturerForm.value.phoneNumber,
      name: this.manufacturerForm.value.manufacturerName,
      type: 'manufacturer',
      company_name: this.manufacturerForm.value.companyName,
      company_license: this.manufacturerForm.value.companyLicence,
      about: this.manufacturerForm.value.aboutCompany,
    };
    if (this.pageType === 'Add') {
      if (this.manufacturerForm.valid) {
        this._manufecturerService.add(body).subscribe((res) => {
          if (res) {
            this.router.navigate(['/manufacturers']);
          }
        });
      } else {
        this.manufacturerForm.markAllAsTouched();
      }
    } else {
      if (this.manufacturerForm.valid) {
        this._manufecturerService.update(this.id, body).subscribe((res) => {
          if (res) {
            this.router.navigate(['/manufacturers']);
          }
        });
      } else {
        this.manufacturerForm.markAllAsTouched();
      }
    }
  }

  get formControls() {
    return this.manufacturerForm.controls;
  }

  setFormValues(): void {
    this.manufacturerForm.patchValue({
      manufacturerName: this.manufecturer.data.user.name,
      email: this.manufecturer.data.user.email,
      phoneNumber: this.manufecturer.data.user.phone,
      companyName: this.manufecturer.data.company_name,
      companyLicence: this.manufecturer.data.company_license,
      aboutCompany: this.manufecturer.data.about,
    });
  }
}
