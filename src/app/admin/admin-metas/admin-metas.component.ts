import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../services/meta-data.service';

@Component({
  selector: 'app-admin-metas',
  templateUrl: './admin-metas.component.html',
})
export class AdminMetasComponent implements OnInit {
  allMetas: any;
  constructor(private metaService: MetaDataService) {}

  ngOnInit(): void {
    this.metaService.getMeta().subscribe((response) => {
      this.allMetas = response;
    });
  }
}
