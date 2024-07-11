import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../../services/meta-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-advertisements',
  templateUrl: './detail-advertisements.component.html',
})
export class DetailAdvertisementsComponent implements OnInit {
  singleAdData: any;

  constructor(
    private metaService: MetaDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAdbyId();
  }

  getAdbyId() {
    const adId = this.route.snapshot.paramMap.get('id');
    this.metaService.getAdvertisementsByid(adId).subscribe((res: any) => {
      this.singleAdData = res.data;
    });
  }
}
