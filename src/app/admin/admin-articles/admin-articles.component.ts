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

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
})
export class AdminArticlesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  allArticles: any;
  allcategories: any;
  selectedCategory: any;
  deleteId: any;
  dtOptions: DataTables.Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  constructor(
    private postService: AllPostsService,
    private categoryService: CategoiesService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      destroy: true, // Ensure DataTables instance is destroyed on rerender
    };
    this.getPosts();
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions); // Trigger initial DataTable render
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); // Clean up subscription
  }

  getPosts() {
    this.postService.getArticles().subscribe((response) => {
      this.allArticles = response;
      this.rerender();
    });
  }

  rerender(): void {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy(); // Destroy existing DataTable instance
        this.dtTrigger.next(this.dtOptions); // Emit signal to render DataTable
      });
    }
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
}
