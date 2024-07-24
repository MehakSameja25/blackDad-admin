import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AllPostsService } from '../services/all-posts.service';
import { CategoiesService } from '../services/categoies.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainNavService } from '../services/main-nav.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
})
export class AdminArticlesComponent implements OnInit {
  allArticles: any;
  allcategories: any;
  selectedCategory: any;
  deleteId: any;
  sharePost: any;
  urlToCopy!: string;
  body: any;
  categoryFilter: any[] = [];

  constructor(
    private postService: AllPostsService,
    private categoryService: CategoiesService,
    private router: Router,
    private modalService: NgbModal,
    private navService: MainNavService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.getCategories();
    setTimeout(() => {
      this.getPosts();
    }, 2000);
  }

  tableData = [];

  tableColumns = [
    { title: 'Image' },
    { title: 'Name' },
    { title: 'Category' },
    // { title: 'File Type' },
    { title: 'Created At' },
    { title: 'Status' },
    { title: 'Action' },
  ];
  @ViewChild('dataTable', { static: false }) table!: ElementRef;

  getPosts() {
    this.body = {};
    this.postService.getArticles(this.body).subscribe((response) => {
      this.allArticles = response;
      this.tableData = response.data.map((item: any) => [
        `<img src="${item.thumbnail}" alt="Thumbnail" style="width: 50px; height: auto;">`,
        item.name,
        item.categoryId,
        item.date,
        item.is_scheduled,
        `<div class="actions d-flex align-items-center gap-2">
          <a class="btn-action-icon" data-id="${item.id}" data-action="open">
            <svg
              xmlns=" http://www.w3.org/2000/svg"
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
           ${
             this.isEditPermission(item) == true
               ? `<a class="btn-action-icon" data-id="${item.id}" data-action="edit">
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
                   </a>`
               : ``
           }
          <a class="btn-action-icon" data-id="${item.id}" data-action="details">
             <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 511.999 511.999"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 0 0 0 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 0 0 0-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                                <path
                                  d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                              </g>
                            </svg>
          </a>
          <a class="btn-action-icon" data-id="${item.id}" data-action="block">
        ${
          item.isBlock == 0
            ? `
        <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 34 34"
                              style="enable-background: new 0 0 16 16"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M17 1c-5 0-9 4-9 9v4c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3h18c1.7 0 3-1.3 3-3V17c0-1.7-1.3-3-3-3v-4c0-5-4-9-9-9zm10 16v13c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V17c0-.6.4-1 1-1h18c.6 0 1 .4 1 1zm-17-3v-4c0-3.9 3.1-7 7-7s7 3.1 7 7v4z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <path
                                  d="M17 19c-1.7 0-3 1.3-3 3 0 1.3.8 2.4 2 2.8V27c0 .6.4 1 1 1s1-.4 1-1v-2.2c1.2-.4 2-1.5 2-2.8 0-1.7-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
        `
            : `
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
                                  d="M331.312 256c0-16.638-13.487-30.125-30.125-30.125h-241c-16.638 0-30.125 13.487-30.125 30.125v210.875C30.063 483.513 43.55 497 60.188 497h241c16.638 0 30.125-13.487 30.125-30.125V256zM240.938 135.5v90.375h60.25V135.5c0-33.275 26.975-60.25 60.25-60.25s60.25 26.975 60.25 60.25v30.125h60.25V135.5c0-66.55-53.95-120.5-120.5-120.5-66.551 0-120.5 53.95-120.5 120.5z"
                                  style="
                                    stroke-width: 30;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <circle
                                  cx="180.688"
                                  cy="346.375"
                                  r="30.125"
                                  style="
                                    stroke-width: 30;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></circle>
                                <path
                                  d="M180.688 376.5v30.125"
                                  style="
                                    stroke-width: 30;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
        `
        }
          </a>
          <a
          data-id="${item.id}" class="btn-action-icon" data-action="shareing">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" x="0" y="0" viewBox="0 0 512 512.005" xml:space="preserve" style="enable-background: new 0 0 16 16;"><g><path d="M453.336 512.004H58.668c-32.363 0-58.664-26.305-58.664-58.664V144.004c0-32.363 26.3-58.664 58.664-58.664h74.668c8.832 0 16 7.168 16 16s-7.168 16-16 16H58.668c-14.7 0-26.664 11.965-26.664 26.664V453.34c0 14.695 11.965 26.664 26.664 26.664h394.668c14.7 0 26.668-11.969 26.668-26.664V272.004c0-8.832 7.168-16 16-16s16 7.168 16 16V453.34c0 32.36-26.305 58.664-58.668 58.664zm0 0" fill="#000000" opacity="1" data-original="#000000"></path><path d="M143.98 341.063a14.09 14.09 0 0 1-3.52-.43c-7.23-1.684-12.456-7.871-12.456-15.293v-32c0-114.688 93.312-208 208-208h5.332V16.004a16.024 16.024 0 0 1 10.027-14.848 15.979 15.979 0 0 1 17.492 3.754l138.668 144c5.973 6.188 5.973 16 0 22.188l-138.668 144c-4.523 4.715-11.5 6.168-17.492 3.754a16.024 16.024 0 0 1-10.027-14.848v-69.332h-25.344c-67.113 0-127.426 37.289-157.418 97.3-2.754 5.548-8.535 9.09-14.594 9.09zM336.004 117.34c-89.602 0-163.797 67.305-174.656 154.023 38.78-43.261 94.398-68.691 154.644-68.691h41.344c8.832 0 16 7.168 16 16v45.652l100.457-104.32-100.457-104.32v45.656c0 8.832-7.168 16-16 16zm0 0" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>
        </a>
        </div>`,
      ]);

      setTimeout(() => this.bindEvents(), 0);
    });
  }

  @ViewChild('contentt')
  public deleteModel!: ElementRef;

  @ViewChild('sharee')
  public shareModel!: ElementRef;

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
        case 'details':
          this.renderer.listen(button, 'click', () => this.toDetails(id));
          break;
        case 'block':
          this.renderer.listen(button, 'click', () => this.checkIsBlock(id));
          break;
        case 'shareing':
          this.renderer.listen(button, 'click', () =>
            this.openShare(this.shareModel, id)
          );
          break;
        default:
          break;
      }
    });
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
    });
  }

  getValue(category: any) {
    if (category == 'All Categories') {
      this.getPosts();
    } else {
      const categoryIdString = category.toString();
      const categoryIndex = this.categoryFilter.indexOf(categoryIdString);

      if (categoryIndex === -1) {
        this.categoryFilter = [categoryIdString];
      }
      this.body = {
        categoryId: this.categoryFilter,
      };
      this.postService.getArticles(this.body).subscribe((res) => {
        this.allArticles = res;
      });
    }
    console.log('Selected Category =>', this.categoryFilter);
  }

  toDetails(id: any) {
    this.router.navigate([`/admin/detail-article/${id}`]);
  }

  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  deleteArticle(id: any) {
    this.postService.deleteArticle(id).subscribe((res) => {
      console.log(res);
      if (res) {
        this.modalService.dismissAll();
        this.getPosts();
      }
    });
  }

  checkIsBlock(articleData: any) {
    this.postService
      .updateIsblock(articleData.id, 'article')
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.getPosts();
        }
      });
  }

  toEdit(id: any) {
    this.router.navigate([`/admin/edit-article/${id}`]);
  }
  addPermission: any;
  editPermission: any;
  isEdit: any;
  isEditAfterPublish: any;
  deletePermission: any;
  checkPermissions() {
    this.navService.getMenu().subscribe((res: any) => {
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Articles') === true) {
            this.addPermission = permission.status.includes('add');
            this.isEdit = permission.status.includes('edit');
            this.isEditAfterPublish =
              permission.status.includes('edit after publish');
            this.deletePermission = permission.status.includes('delete');
            //  console check
            console.log('add permission', this.addPermission);
            console.log('delete permission', this.deletePermission);
            console.log('edit permission', this.isEdit);
            console.log(
              'edit after publish permission',
              this.isEditAfterPublish
            );
          }
        }
      }
    });
  }

  isEditPermission(article: any) {
    console.log(this.isEdit, this.isEditAfterPublish);
    if (this.isEdit == true && this.isEditAfterPublish == true) {
      return true;
    } else if (this.isEdit && article.isPublished == 0) {
      return true;
    } else {
      return false;
    }
  }

  openShare(content: any, post: any) {
    console.log(post);
    this.sharePost = this.allArticles.data.find((data: any) => data.id == post);
    console.log(this.sharePost);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });

    const title = this.sharePost.name.trim().replace(/\s+/g, '_');
    const url = `${environment.shareUrl}/${this.sharePost.type ?? 'articles'}/${
      this.sharePost.id
    }/${title}`;
    this.urlToCopy = url;
  }

  copyMessage: string = 'Copy';
  copyClass: string = '';
  tickClass: string = 'd-none';
  share() {
    this.copyTextToClipboard(this.urlToCopy);
    this.copyMessage = 'Link Copied!';
    this.copyClass = 'd-none';
    this.tickClass = '';
    setTimeout(() => {
      this.copyMessage = 'Copy Link';
      this.copyClass = '';
      this.tickClass = 'd-none';
      this.modalService.dismissAll();
    }, 2000);
  }

  copyTextToClipboard(text: string) {
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    tempElement.setAttribute('readonly', '');
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';

    document.body.appendChild(tempElement);

    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
  }
}
