import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AllPostsService } from '../services/all-posts.service';
import { CategoiesService } from '../services/categoies.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as DataTables from 'datatables.net';
import 'datatables.net-bs4';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MainNavService } from '../services/main-nav.service';

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
})
export class AdminArticlesComponent
  implements OnInit
{
  allArticles: any;
  allcategories: any;
  selectedCategory: any;
  deleteId: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private postService: AllPostsService,
    private categoryService: CategoiesService,
    private router: Router,
    private modalService: NgbModal,
    private navService: MainNavService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.getPosts();
    this.getCategories();
    this.checkPermissions();
  }

  getPosts() {
    this.postService.getArticles().subscribe((response) => {
      this.allArticles = response;
      this.dtTrigger.next(this.dtOptions);
    });
  }


  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
    });
  }

  getValue() {
    console.log('Selected Category =>', this.selectedCategory);
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

  checkIsBlock(articleData: any, type: any) {
    this.postService.updateIsblock(articleData.id, type).subscribe((res) => {
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
      this.addPermission = res.data[0].role_accesses[2].status.includes('add');
      //  --- FOR edit --
      this.isEdit = res.data[0].role_accesses[2].status.includes('edit');
      this.isEditAfterPublish =
        res.data[0].role_accesses[2].status.includes('edit after publish');
      //  -- FOR Delete
      this.deletePermission =
        res.data[0].role_accesses[2].status.includes('delete');

      //  console check
      console.log('add permission', this.addPermission);
      console.log('delete permission', this.deletePermission);
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

  goBack(): void {
    window.history.back();
  }
}
