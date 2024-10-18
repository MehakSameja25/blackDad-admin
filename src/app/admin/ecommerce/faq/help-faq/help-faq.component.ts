import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-help-faq',
  templateUrl: './help-faq.component.html',
  styleUrls: ['./help-faq.component.css'],
})
export class HelpFaqComponent {
  tableData = [];
  tableColumns = [
    { title: 'Question' },
    { title: 'Answer' },
    { title: 'Action' },
  ];
  @ViewChild('dataTable', { static: false }) table!: ElementRef;
}
