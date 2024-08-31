import { Component, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { AuthanticationService } from '../../services/authantication.service';
import { MainNavService } from '../../services/main-nav.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES } from '../../countries';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from '../../model/menu.model';
import { SingleArticle } from '../../model/article.model';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
})
export class DetailArticleComponent {
  articleDetails!: SingleArticle;
  sanitizedDescription: SafeHtml | undefined;
  successalertClass: string = 'd-none';
  successMessage: string = '';
  publishPermission!: boolean;
  type!: string;
  postId: string | null | undefined;
  constructor(
    private route: ActivatedRoute,
    private postsService: AllPostsService,
    private sanitizer: DomSanitizer,
    private authService: AuthanticationService,
    private navService: MainNavService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group({
      country: ['', Validators.required],
      timezone: ['', Validators.required],
      scheduled_at: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.checkPermission();
  }

  getDetails() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.postsService.getArticlesDetails(this.postId).subscribe((response) => {
      if (response) {
        this.articleDetails = response;
        if (this.articleDetails?.data?.description) {
          this.sanitizedDescription = this.sanitizeDescription(
            this.articleDetails.data.description
          );
          console.log('CALLLED');
          this.getSchedulingDetails();
        }
      }
    });
  }

  sanitizeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }
  countryName!: string | null;

  timezonne!: string | null;

  scheduledTime!: string | null;

  getSchedulingDetails() {
    this.countryName = this.articleDetails.data.country;
    this.timezonne = this.articleDetails.data.timezone;
    this.scheduledTime = this.articleDetails.data.publish_date;
  }
  approved(articleData: { id: string | number }, approve: string) {
    this.postsService
      .updateIsApproved(articleData.id, 'article', approve)
      .subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  publish(articleData: { id: string }) {
    this.postsService
      .updateIsPublished(articleData.id, 'article')
      .subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  checkPermission() {
    const userId = localStorage.getItem('userId');
    this.authService.getUserById(userId).subscribe((res) => {
      this.type = res.data.role.name;
    });
    this.navService.getMenu().subscribe((res: Menu) => {
      if (res) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Articles') === true) {
            this.publishPermission = permission.status.includes('publish');
          }
        }
        this.getDetails();
      }
    });
  }
  scheduleForm!: FormGroup;
  countries: {
    code: string;
    name: string;
    timezones: {
      tzCode: string;
      utc: string;
    }[];
  }[] = COUNTRIES;

  timezones: {
    tzCode: string;
    utc: string;
  }[] = [];
  openScheduleModal(content: TemplateRef<unknown>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  schedule() {
    if (this.scheduleForm.valid) {
      const formData = this.createEpisodeFormData();
      formData.append('country', this.scheduleForm.value.country);
      formData.append('timezone', this.scheduleForm.value.timezone);
      formData.append('publish_date', this.scheduleForm.value.scheduled_at);
      formData.append('is_scheduled', 'scheduled');
      this.postsService
        .updateArticle(this.postId, formData)
        .subscribe((res) => {
          if (res) {
            this.checkPermission();
            this.ngOnInit();
            this.modalService.dismissAll();
          }
        });
    } else {
      this.markFormGroupTouched(this.scheduleForm);
    }
  }

  onCountryChange() {
    const selectedCountry = this.scheduleForm.get('country')?.value;
    console.log('selectedCountry => ', selectedCountry);
    const country = this.countries.find(
      (c: { name: string }) => c.name === selectedCountry
    );

    this.timezones = country ? country.timezones : [];
    console.log('timezones => ', this.timezones);

    this.scheduleForm.patchValue({
      timezone: '',
    });
  }
  private createEpisodeFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.articleDetails.data.name);
    formData.append('type', 'articles');
    formData.append('categoryId', this.articleDetails.data.categoryId);
    formData.append('description', this.articleDetails.data.description);
    //     formData.append('thumbnail', this.episodeForm.value.thumbnailImage);
    // formData.append('image', this.episodeForm.value.bannerImage);
    formData.append(
      'meta_description',
      this.articleDetails.data.meta_description
    );
    // formData.append('date', this.articleDetails.data.date);
    formData.append('slug', this.articleDetails.data.description);
    formData.append('file', '');
    formData.append('reason', '');
    formData.append('url', '');
    formData.append('isBlock', this.articleDetails.data.isBlock);
    formData.append('isApproved', this.articleDetails.data.isApproved);
    formData.append('isPublished', this.articleDetails.data.isPublished);
    return formData;
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
