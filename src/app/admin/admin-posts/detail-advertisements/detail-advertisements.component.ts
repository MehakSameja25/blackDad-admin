import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../../services/meta-data.service';
import { ActivatedRoute } from '@angular/router';
import { SingleAdvertisement } from '../../model/ad.model';

@Component({
  selector: 'app-detail-advertisements',
  templateUrl: './detail-advertisements.component.html',
})
export class DetailAdvertisementsComponent implements OnInit {
  singleAdData!: SingleAdvertisement;

  constructor(
    private metaService: MetaDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAdbyId();
  }

  /**
   * @description Retrieves the details of a specific advertisement using its ID, which is extracted from the current URL.
   * This method fetches advertisement details from the server based on the ID obtained from the URL's parameter map.
   * Upon a successful response, it updates the component's state with the advertisement data.
   */

  getAdbyId() {
    const adId = this.route.snapshot.paramMap.get('id');
    this.metaService
      .getAdvertisementsByid(adId)
      .subscribe((res: SingleAdvertisement) => {
        if (res) {
          this.singleAdData = res;
        }
      });
  }
}
