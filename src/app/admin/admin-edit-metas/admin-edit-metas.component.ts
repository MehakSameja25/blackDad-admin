import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../services/meta-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SingleMeta } from '../model/meta.model';

@Component({
  selector: 'app-admin-edit-metas',
  templateUrl: './admin-edit-metas.component.html',
})
export class AdminEditMetasComponent implements OnInit {
  allMetas!: SingleMeta;
  meta_for!: string | null;
  metaForm!: FormGroup;
  constructor(
    private metaService: MetaDataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.metaForm = this.fb.group({
      description: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getMetas();
  }

  getMetas() {
    this.meta_for = this.route.snapshot.paramMap.get('type');
    this.metaService
      .getMetaDetail(this.meta_for)
      .subscribe((res: SingleMeta) => {
        if (res) {
          this.allMetas = res;
        }
      });
  }
  handleSubmit() {
    const body = {
      meta_for: this.meta_for,
      meta_description: this.metaForm.value.description,
    };
    this.metaService.updateMeta(body).subscribe((res) => {
      console.log(res);
      if (res) {
        this.router.navigate(['/admin/metas']);
      }
    });
  }
}
