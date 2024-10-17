import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warehouse-location',
  templateUrl: './warehouse-location.component.html',
  styleUrls: ['./warehouse-location.component.css'],
})
export class WarehouseLocationComponent {
  /** --Table Declarations **/
  @ViewChild('dataTable', { static: false })
  public table!: Element;
  public tableData = [];
  public tableColumns: { title: string }[] = [];

  constructor(private modalService: NgbModal) {}

  openAdd(content: TemplateRef<unknown>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-sm',
    });
  }
}
