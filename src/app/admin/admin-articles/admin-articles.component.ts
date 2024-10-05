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
import { Article } from '../model/article.model';
import { Category } from '../model/category.model';
import { Menu } from '../model/menu.model';

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
})
export class AdminArticlesComponent implements OnInit {
  /**--------Start of Variable Declarations---------**/

  /** --Public Variables-- **/
  public allArticles!: Article;
  public allcategories!: Category;
  public urlToCopy!: string;
  public addPermission!: boolean;

  /** --Private Variables-- **/
  private sharePost:
    | {
        id: string | number | null;
        name: string;
        description: string;
        image: string;
        thumbnail: string;
        isBlock: string;
        isPublished: string;
        isApproved: string;
        reason: string;
        meta_title: null | string;
        meta_description: string;
        meta_url: null | string;
        slug: string;
        date: string;
        url: null | string;
        categoryId: string;
        country: null | string;
        timezone: null | string;
        publish_date: null | string;
        is_scheduled: string;
        userId: number;
        category: Category;
      }
    | undefined;
  private isEdit!: boolean;
  private deleteId!: string | null;
  protected deletePermission!: boolean;
  private isEditAfterPublish!: boolean;
  private categoryFilter: string[] = [];
  private body!: { categoryId: number } | {};
  protected copyMessage: string = 'Copy';
  protected copyClass: string = '';
  protected tickClass: string = 'd-none';

  /** --Modal Declarations-- **/
  @ViewChild('contentt')
  public deleteModel!: ElementRef;

  @ViewChild('sharee')
  public shareModel!: ElementRef;

  /** --Table Declarations **/
  @ViewChild('dataTable', { static: false })
  public table!: ElementRef;
  public tableData = [];
  public tableColumns: { title: string }[] = [
    { title: 'Image' },
    { title: 'Name' },
    { title: 'Category' },
    { title: 'Created At' },
    { title: 'Status' },
    { title: 'Action' },
  ];
  /**---------End of Variable Declarations----------**/

  /** --------Injection for services and important in built packages------- **/
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private navService: MainNavService,
    private postService: AllPostsService,
    private categoryService: CategoiesService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
  }

  /**
   * @description Retrieves and displays articles based on the category filter. If a filter is applied, it includes the filter criteria in the request; otherwise, it fetches all articles. The response is used to populate a table with article details including thumbnail, title, categories, creation date, status, and action buttons (view, edit, block/unblock, share).

   */
  getPosts() {
    if (this.categoryFilter.length > 0) {
      this.body = {
        categoryId: this.categoryFilter,
      };
    } else {
      this.body = {};
    }
    this.postService.getArticles(this.body).subscribe((response) => {
      this.allArticles = response;
      this.tableData = response.data.map((item: any) => [
        `<img src="${item.thumbnail}" alt="Thumbnail" style="border-radius: 10px; width: 60px; height: 60px;">`,
        item.name.length > 35 ? this.truncateDescription(item.name) : item.name,
        `<ul> ${
          item.category && item.category.length
            ? item.category
                .map((cat: { name: string }) => `<li> ${cat.name} </li>`)
                .join('')
            : item.article_with_types[0].article_type.name
        }  </ul>`,
        item.created_at ? item.created_at.split('T')[0] : 'N/A',
        this.getScheduledStatus(item.isApproved, item.isPublished),
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
          item.isBlock == '1'
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

  /**
   * @description  Attaches event listeners to action buttons within the table. Each button's action (e.g., open, edit, details, block, share) is handled based on its 'data-action' attribute, and the corresponding method is called with the button's 'data-id' as an argument.
   */
  private actionListener: (() => void) | null = null;

  bindEvents(): void {
    // Check if the listener is already set
    if (this.actionListener) {
      return; // Exit if the listener is already set
    }

    const tableElement = this.table.nativeElement;

    this.actionListener = this.renderer.listen(
      tableElement,
      'click',
      (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest('.btn-action-icon, .btn-danger');

        if (button) {
          const action = button.getAttribute('data-action');
          const id = button.getAttribute('data-id');

          if (action && id) {
            switch (action) {
              case 'open':
                this.open(this.deleteModel, id);
                break;
              case 'edit':
                this.toEdit(id);
                break;
              case 'details':
                this.toDetails(id);
                break;
              case 'block':
                this.updateBlock(id);
                break;
              case 'shareing':
                this.openShare(this.shareModel, id);
                break;
              default:
                break;
            }
          }
        }
      }
    );
  }
  /**
   * @description Fetches and stores a list of unblocked categories from the category service. Updates 'allcategories' with the response data.
   */
  getCategories() {
    this.categoryService
      .unblockedCategories()
      .subscribe((response: Category) => {
        if (response) {
          this.allcategories = response;
        }
      });
  }

  /**
   * @description Updates the category filter based on the selected category. If 'All Categories' is selected, clears the filter. Otherwise, sets the filter to the selected category and then refreshes the posts.
   * @param category
   */
  getValue(category: string) {
    if (category == 'All Categories') {
      this.categoryFilter = [];
    } else {
      const categoryIndex = this.categoryFilter.indexOf(category);

      if (categoryIndex === -1) {
        this.categoryFilter = [category];
      }
    }
    this.getPosts();
  }

  /**
   * @description Navigates to the detail view of an article using its ID.
   * @param id
   */
  toDetails(id: string | null) {
    this.router.navigate([`/admin/detail-article/${id}`]);
  }

  /**
   * @description Opens a modal for article deletion and sets the article ID to be deleted.
   * @param content
   * @param id
   */
  open(content: ElementRef<unknown>, id: string | null) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });
  }

  /**
   * @description Deletes the article with the specified ID and refreshes the post list upon success.
   */
  deleteArticle() {
    this.postService.deleteArticle(this.deleteId).subscribe((res) => {
      if (res) {
        this.modalService.dismissAll();
        this.getPosts();
      }
    });
  }

  /**
   * @description Toggles the block status of the article with the specified ID and refreshes the post list upon success.
   * @param id
   */
  updateBlock(id: string | null) {
    this.postService.updateIsblock(id, 'article').subscribe((res) => {
      if (res) {
        this.getPosts();
      }
    });
  }

  /**
   * @description  Navigates to the article editing view using the article ID.
   * @param id
   */
  toEdit(id: string | null) {
    this.router.navigate([`/admin/edit-article/${id}`]);
  }

  /**
   * @description Checks user permissions for various actions and sets the corresponding flags. Fetches the post list after updating permissions.
   */
  checkPermissions() {
    this.navService.getMenu().subscribe((res: Menu) => {
      console.log(res);
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Articles') === true) {
            this.addPermission = permission.status.includes('add');
            this.isEdit = permission.status.includes('edit');
            this.isEditAfterPublish =
              permission.status.includes('edit after publish');
            this.deletePermission = permission.status.includes('delete');
          }
        }
        this.getPosts();
      }
    });
  }
  /**
   * @description  Determines if the current user has permission to edit the given article based on its publication status and permission flags.
   * @param article
   * @returns
   */
  isEditPermission(article: { isPublished: string }) {
    if (this.isEdit == true && this.isEditAfterPublish == true) {
      return true;
    } else if (this.isEdit && article.isPublished == '0') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description Opens a modal for sharing a post and generates a shareable URL.
   * @param content - The ElementRef for the modal content.
   * @param post - The ID of the post to be shared.
   *
   * Finds the post from `allArticles` data based on the provided `post` ID,
   * logs the post details, and opens a modal with sharing options. Generates a
   * URL for the post based on its type and ID, then sets this URL to `urlToCopy`.
   */
  openShare(content: ElementRef, post: string | null) {
    this.sharePost = this.allArticles.data.find(
      (data: { id: string | number }) => data.id == post
    );
    console.log(this.sharePost);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });

    const title = this.sharePost?.name.trim().replace(/\s+/g, '_');
    const url = `${environment.shareUrl}/${'articles'}/${
      this.sharePost?.id
    }/${title}`;
    this.urlToCopy = url;
  }

  /**
   * @description Copies the shareable URL to the clipboard and updates the UI to reflect the copy action.
   *
   * Calls `copyTextToClipboard` to copy the `urlToCopy` to the clipboard,
   * updates the UI to show a confirmation message, and then resets the message
   * and UI state after a short delay. Dismisses the modal after the action is complete.
   */
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

  /**
   * @description Copies the provided text to the clipboard.
   * @param text - The text to be copied to the clipboard.
   *
   * Creates a temporary textarea element, sets its value to the provided text,
   * and programmatically selects and copies the text. The temporary element is
   * removed from the document after the copy operation.
   */
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

  /**
   * @description Truncates a description to a specified length with an ellipsis if it exceeds the length.
   * @param description - The description text to be truncated.
   * @returns The truncated description with an ellipsis if it exceeds 25 characters, otherwise returns the original description.
   *
   * Checks the length of the provided description and truncates it to a maximum
   * of 25 characters, appending an ellipsis if necessary.
   */
  truncateDescription(description: string): string {
    return description.length > 25
      ? `${description.slice(0, 25)}...`
      : description;
  }

  /**
   * @description Returns the status of a post based on approval and publication status.
   * @param isApproved - The approval status of the post.
   * @param isPublished - The publication status of the post.
   * @returns A string containing HTML to display a badge with the post's status.
   *
   * Determines the status of a post by evaluating its approval and publication
   * status and returns an HTML string with a badge indicating the current status
   * (e.g., Pending, Approved, Rejected, Published).
   */
  getScheduledStatus(isApproved: string, isPublished: string): string {
    if (isApproved == '0' && isPublished == '0') {
      return `<span class="badge rounded-pill text-bg-warning">Pending</span>`;
    } else if (isApproved == '1' && isPublished == '0') {
      return `<span class="badge rounded-pill text-bg-success">Approved</span>`;
    } else if (isApproved == '2' && isPublished == '0') {
      return `<span class="badge rounded-pill text-bg-danger">Rejected</span>`;
    } else if (isApproved == '1' && isPublished == '1') {
      return `<span class="badge rounded-pill text-bg-violet">Published</span>`;
    } else {
      return '';
    }
  }
}
