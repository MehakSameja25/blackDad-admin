import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationWarehouseService } from '../../services/location-warehouse.service';

@Component({
  selector: 'app-warehouse-location',
  templateUrl: './warehouse-location.component.html',
  styleUrls: ['./warehouse-location.component.css'],
})
export class WarehouseLocationComponent implements OnInit {
  myForm!: FormGroup;
  warehouseData: any;
  warehouseType!: string;
  warehouseId: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private warehouseService: LocationWarehouseService
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.getList();
  }

  openAdd(content: TemplateRef<unknown>, type: string, data: any = null) {
    this.warehouseType = type;
    this.myForm.reset();
    if (type === 'Edit' || type === 'Delete') {
      this.warehouseId = data.id;
      this.myForm.patchValue({
        name: data.name,
        city: data.city,
        pincode: data.zip_code,
      });
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: `modal-dialog-centered modal-${
        type === 'Delete' ? 'md' : 'sm'
      }`,
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const body: any = {
        name: this.myForm.value.name,
        city: this.myForm.value.city,
        zip_code: this.myForm.value.pincode,
      };

      if (this.warehouseType === 'Edit') {
        body.warehouseId = this.warehouseId;
      }
      this.warehouseService.add(body).subscribe((res) => {
        if (res) {
          this.getList();
          this.modalService.dismissAll();
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  getList() {
    this.warehouseService.list().subscribe((res: any) => {
      if (res) {
        this.warehouseData = res.data;
      }
    });
  }

  delete() {
    this.warehouseService.delete(this.warehouseId).subscribe((res) => {
      if (res) {
        this.modalService.dismissAll();
        this.getList();
      }
    });
  }
}
