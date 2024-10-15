import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthanticationService } from '../../services/authantication.service';
import { MainNavService } from '../../services/main-nav.service';
import { COUNTRIES } from '../../countries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu } from '../../model/menu.model';
import { Episode, SingleEpisode } from '../../model/episode.model';

@Component({
  selector: 'app-detail-episode',
  templateUrl: './detail-episode.component.html',
  styleUrls: ['./detail-episode.component.css'],
})
export class DetailEpisodeComponent implements OnInit {
  episodeDetails!: SingleEpisode;
  sanitizedDescription: SafeHtml | undefined;
  sanitizedUrl: SafeHtml | undefined;
  successalertClass: string = 'd-none';
  successMessage: string = '';
  type!: string;
  publishPermission: boolean = false;
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
  postId!: string | null;
  countryName!: string | null;
  timezonne!: string | null;
  scheduledTime!: string | null;
  approvePermiision!: boolean;
  constructor(
    private route: ActivatedRoute,
    private postsService: AllPostsService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private authService: AuthanticationService,
    private navService: MainNavService,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group({
      country: ['', Validators.required],
      timezone: ['', Validators.required],
      scheduled_at: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.postsService.getEpisodeDetails(this.postId).subscribe((response) => {
        if (response) {
          this.episodeDetails = response;
          this.getSchedulingDetails();
          if (this.episodeDetails?.data?.description) {
            this.sanitizedDescription = this.sanitizeDescription(
              this.episodeDetails.data.description
            );
          }
        }
      });
    }
    this.checkPermission();
  }

  isLoading = true;

  onImageLoad() {
    this.isLoading = false;
  }

  getSchedulingDetails() {
    this.countryName = this.episodeDetails.data.country;
    this.timezonne = this.episodeDetails.data.timezone;
    this.scheduledTime = this.episodeDetails.data.publish_date;
  }
  open(content: TemplateRef<unknown>, post: { url: string }) {
    this.scheduleForm.reset();
    if (post) {
      this.sanitizedUrl = this.sanitizeUrl(post.url);
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  sanitizeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  sanitizeUrl(url: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(url);
  }

  approved(episodeData: { id: string | number | null }, approve: string) {
    this.postsService
      .updateIsApproved(episodeData.id, 'episode', approve)
      .subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  publish(episodeData: { id: string | number | null }) {
    this.postsService
      .updateIsPublished(episodeData.id, 'episode')
      .subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  openScheduleModal(content: TemplateRef<unknown>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  checkPermission() {
    const userId = localStorage.getItem('userId');
    this.authService.getUserById(userId).subscribe((res) => {
      this.type = res.data.role.name;
    });
    this.navService.getMenu().subscribe((res: Menu) => {
      for (let permission of res.data[0].role_accesses) {
        if (permission.menu_bar.title === 'Episodes') {
          this.approvePermiision = permission.status.includes('approve');
          this.publishPermission = permission.status.includes('publish');
          console.log('publish permission', this.publishPermission);
        }
      }
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
        .updateEpisode(this.postId, formData)
        .subscribe((res) => {
          if (res) {
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
    const country = this.countries.find((c) => c.name === selectedCountry);

    this.timezones = country ? country.timezones : [];
    console.log('timezones => ', this.timezones);

    this.scheduleForm.patchValue({
      timezone: '',
    });
  }

  private createEpisodeFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.episodeDetails.data.name);
    formData.append('type', this.episodeDetails.data.type);
    formData.append('categoryId', this.episodeDetails.data.categoryId);
    formData.append('description', this.episodeDetails.data.description);
    //     formData.append('thumbnail', this.episodeForm.value.thumbnailImage);
    // formData.append('image', this.episodeForm.value.bannerImage);
    formData.append('filetype', this.episodeDetails.data.filetype);
    formData.append(
      'meta_description',
      this.episodeDetails.data.meta_description
    );
    formData.append('subtype', this.episodeDetails.data.subtype);
    formData.append('episodeNo', this.episodeDetails.data.episodeNo.toString());
    formData.append('seasonNo', this.episodeDetails.data.seasonNo.toString());
    formData.append('slug', this.episodeDetails.data.description);
    formData.append('file', '');
    formData.append('reason', '');
    formData.append('url', this.episodeDetails.data.url);
    formData.append('isBlock', this.episodeDetails.data.isBlock);
    formData.append('isApproved', this.episodeDetails.data.isApproved);
    formData.append('isPublished', this.episodeDetails.data.isPublished);
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
