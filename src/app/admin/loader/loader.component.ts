import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `<div *ngIf="loading$ | async" class="loader-overlay">
    <div class="spinner"></div>
  </div> `,
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  loading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}
}
