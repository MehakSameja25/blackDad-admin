import { Component, OnInit } from '@angular/core';
import { AllPostsService } from '../services/all-posts.service';
import { Router } from '@angular/router';
import { CategoiesService } from '../services/categoies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  constructor(
    private postService: AllPostsService,
    private categoryService: CategoiesService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getPosts();
    this.getCategories();
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
    });
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }

  getValue() {
    console.log('Selected Category =>', this.selectedCategory);
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
}
