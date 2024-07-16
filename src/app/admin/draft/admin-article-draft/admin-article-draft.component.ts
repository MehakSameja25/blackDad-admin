import { Component } from '@angular/core';
import { AllPostsService } from '../../services/all-posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-article-draft',
  templateUrl: './admin-article-draft.component.html',
  styleUrls: ['./admin-article-draft.component.css']
})
export class AdminArticleDraftComponent {
  allDraftdata: any;
  deleteId: any;
  successClass: string = 'd-none';
  successMessage!: string;
  constructor(
    private postService: AllPostsService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.getDraft();
  }

  getDraft() {
    this.postService.getDraft('articles').subscribe((res) => {
      this.allDraftdata = res;
      console.log(res);
    });
  }
  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  deleteDraft() {
    this.postService.deleteDraft(this.deleteId).subscribe((res: any) => {
      if (res) {
        this.modalService.dismissAll();
        this.successMessage = 'Draft Deleted!';
        this.successClass = '';
        this.getDraft();
        setTimeout(() => {
          this.successMessage = '';
          this.successClass = 'd-none';
        }, 5000);
      }
    });
  }
}
