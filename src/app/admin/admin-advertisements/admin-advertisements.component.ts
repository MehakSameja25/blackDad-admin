import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../services/meta-data.service';
import { AllPostsService } from '../services/all-posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-advertisements',
  templateUrl: './admin-advertisements.component.html',
})
export class AdminAdvertisementsComponent implements OnInit {
  allAdvertisements: any;
  deleteId: any;

  constructor(
    private metaService: MetaDataService,
    private postService: AllPostsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //  Render Advertisements
    this.getAdvetisements();
  }

  getAdvetisements() {
    this.metaService.getAdvertisements().subscribe((response) => {
      this.allAdvertisements = response;
    });
  }
  checkIsBlock(adData: any, type: any) {
    this.postService.updateIsblock(adData.id, type).subscribe((res) => {
      if (res) {
        console.log(res);
        this.getAdvetisements();
      }
    });
  }

  open(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }
  deleteAd() {
    this.metaService.deleteAdvertisements(this.deleteId).subscribe((res) => {
      if (res) {
        this.getAdvetisements();
      }
    });
  }

  adPage(page: any) {
    if (page == 'all') {
      this.getAdvetisements();
    } else {
      this.metaService.filterAdvertisement(page).subscribe((res) => {
        this.allAdvertisements = res;
      });
    }
    console.log('Advertisement Page =>', page);
  }
}
