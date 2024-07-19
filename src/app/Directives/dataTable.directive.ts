import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import 'datatables.net';
import * as $ from 'jquery';

@Directive({
  selector: '[appDataTable]'
})
export class DataTableDirective implements OnChanges, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];

  private dataTable: any;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columns']) {
      this.initializeDataTable();
    }
  }

  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  private initializeDataTable() {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.data);
      this.dataTable.draw();
    } else {
      this.dataTable = $(this.el.nativeElement).DataTable({
        data: this.data,
        columns: this.columns
      });
    }
  }
}
