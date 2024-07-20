import { Component, OnInit } from '@angular/core';
import { AllPostsService } from '../../services/all-posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainNavService } from '../../services/main-nav.service';

@Component({
  selector: 'app-admin-episode-draft',
  templateUrl: './admin-episode-draft.component.html',
  styleUrls: ['./admin-episode-draft.component.css'],
})
export class AdminEpisodeDraftComponent implements OnInit {
  allDraftdata: any;
  deleteId: any;
  successClass: string = 'd-none';
  successMessage!: string;
  constructor(
    private postService: AllPostsService,
    private modalService: NgbModal,
    private navService: MainNavService
  ) {}
  ngOnInit(): void {
    this.checkPermissions();
    this.getDraft();
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
          if ((permission.menu_bar.title == 'Episodes') === true) {
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
  getDraft() {
    this.postService.getDraft('episodes').subscribe((res) => {
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
