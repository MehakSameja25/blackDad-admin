import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MetaDataService } from '../services/meta-data.service';
import { Router } from '@angular/router';
import { MetaList, SingleMeta } from '../model/meta.model';

@Component({
  selector: 'app-admin-metas',
  templateUrl: './admin-metas.component.html',
})
export class AdminMetasComponent implements OnInit {
  allMetas!: MetaList;
  constructor(
    private metaService: MetaDataService,
    private router: Router,
    private renderer: Renderer2
  ) {}
  tableData: any = [];

  tableColumns = [{ title: 'Meta For' }, { title: 'Action' }];
  @ViewChild('dataTable', { static: false }) table!: ElementRef;
  ngOnInit(): void {
    this.metaService.getMeta().subscribe((response: MetaList) => {
      this.allMetas = response;
      this.tableData = response.data.map((item: { meta_for: string }) => [
        item.meta_for,
        `<div class="actions d-flex align-items-center gap-2">
                          <a
                            routerLink="/admin/edit-advertisement/{{ ad.id }}"
                            class="btn-action-icon"
                            data-id="${item.meta_for}" data-action="edit"
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
                            </svg>`,
      ]);

      setTimeout(() => this.bindEvents(), 0);
    });
  }

  @ViewChild('contentt')
  public deleteModel!: ElementRef;

  bindEvents(): void {
    const tableElement = this.table.nativeElement;
    const actionButtons = tableElement.querySelectorAll(
      '.btn-action-icon, .btn-danger'
    );

    actionButtons.forEach((button: HTMLElement) => {
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      switch (action) {
        case 'edit':
          this.renderer.listen(button, 'click', () => this.toEdit(id));
          break;

        // case 'shareing':
        //   this.renderer.listen(button, 'click', () =>
        //     this.openShare(this.shareModel, id)
        //   );
        //   break;
        default:
          break;
      }
    });
  }
  toEdit(id: string | null) {
    this.router.navigate([`/admin/edit-metas/${id}`]);
  }
}
