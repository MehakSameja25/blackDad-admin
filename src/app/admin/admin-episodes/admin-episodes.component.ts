import { Component, OnInit } from '@angular/core';
import { AllPostsService } from '../services/all-posts.service';
import { Router } from '@angular/router';
import { CategoiesService } from '../services/categoies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainNavService } from '../services/main-nav.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-episodes',
  templateUrl: './admin-episodes.component.html',
  styleUrls: ['./admin-episodes.component.css'],
})
export class AdminEpisodesComponent implements OnInit {
  allEpisodes: any;
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

  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  getPosts() {
    this.postService.getEpisodes().subscribe((response) => {
      this.allEpisodes = response;
      this.dtTrigger.next(this.dtOptions);
    });
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }

  getValue(category: any) {
    if (category == 'All Categories') {
      this.getPosts();
    } else {
      this.postService.filterPostByCategory(category).subscribe((res) => {
        this.allEpisodes = res;
      });
    }
    console.log('Selected Category =>', category);
  }

  toDetails(id: any) {
    this.router.navigate([`/admin/detail-episode/${id}`]);
  }
  toEdit(id: any) {
    this.router.navigate([`/admin/edit-episode/${id}`]);
  }
  deleteEpisode(id: any) {
    this.postService.deleteEpisode(id).subscribe((res) => {
      console.log(res);
      if (res) {
        this.modalService.dismissAll();
        this.ngOnInit();
      }
    });
  }

  checkIsBlock(episodeData: any, type: any) {
    this.postService.updateIsblock(episodeData.id, type).subscribe((res) => {
      if (res) {
        console.log(res);
        this.ngOnInit();
      }
    });
  }
  addPermission: any;
  editPermission: any;
  isEdit: any;
  isEditAfterPublish: any;
  deletePermission: any;
  checkPermissions() {
    this.navService.getMenu().subscribe((res: any) => {
      this.addPermission = res.data[0].role_accesses[1].status.includes('add');
      //  --- FOR edit --
      this.isEdit = res.data[0].role_accesses[1].status.includes('edit');
      this.isEditAfterPublish =
        res.data[0].role_accesses[1].status.includes('edit after publish');
      //  -- FOR Delete
      this.deletePermission =
        res.data[0].role_accesses[1].status.includes('delete');

      //  console check
      console.log('add permission', this.addPermission);
      console.log('delete permission', this.deletePermission);
    });
  }

  isEditPermission(episode: any) {
    // console.log(episode);
    if (this.isEdit == true && this.isEditAfterPublish == true) {
      return true;
    } else if (this.isEdit && episode.isPublished == 0) {
      return true;
    } else {
      return false;
    }
  }
  getPostByFileType(type: any) {
    if (type === 'all') {
      this.getPosts();
    } else {
      this.postService.filterPostByFileType(type).subscribe((response) => {
        this.allEpisodes = response;
        this.dtTrigger.next(this.dtOptions);
      });
    }
    console.log(type);
  }
}
