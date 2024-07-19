import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthanticationService } from '../../services/authantication.service';
import { MainNavService } from '../../services/main-nav.service';
import { COUNTRIES } from '../../countries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-episode',
  templateUrl: './detail-episode.component.html',
  styleUrls: ['./detail-episode.component.css'],
})
export class DetailEpisodeComponent implements OnInit {
  episodeDetails: any;
  sanitizedDescription: SafeHtml | undefined;
  sanitizedUrl: SafeHtml | undefined;
  successalertClass: any = 'd-none';
  successMessage: any = '';
  type: any;
  publishPermission: any = false;
  scheduleForm!: FormGroup;
  countries: any = COUNTRIES;
  timezones: any[] = [];
  postId!: string | null;

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
    this.postsService.getEpisodeDetails(this.postId).subscribe((response) => {
      this.episodeDetails = response;
      if (this.episodeDetails?.data?.description) {
        this.sanitizedDescription = this.sanitizeDescription(
          this.episodeDetails.data.description
        );
      }
    });
    this.checkPermission();
  }

  isLoading = true;

  onImageLoad() {
    this.isLoading = false;
  }

  open(content: any, post: any) {
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

  approved(episodeData: any, type: any, approve: any) {
    this.postsService
      .updateIsApproved(episodeData.id, type, approve)
      .subscribe((res) => {
        if (res) {
          if (approve == 1) {
            this.showSuccessMessage('Episode Approved');
          } else if (approve == 2) {
            this.showSuccessMessage('Episode Rejected');
          }
        }
      });
  }

  publish(episodeData: any, type: any) {
    this.postsService
      .updateIsPublished(episodeData.id, type)
      .subscribe((res) => {
        if (res) {
          this.showSuccessMessage('Episode Published');
        }
      });
  }

  openScheduleModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  checkPermission() {
    const userId = localStorage.getItem('userId');
    this.authService.getUserById(userId).subscribe((res) => {
      this.type = res.data.role.name;
    });
    this.navService.getMenu().subscribe((res: any) => {
      for (let permission of res.data[0].role_accesses) {
        if (permission.menu_bar.title === 'Episodes') {
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
            this.modalService.dismissAll();
          }
        });
    } else {
      console.log('Form Invalid');
    }
  }

  onCountryChange() {
    const selectedCountry = this.scheduleForm.get('country')?.value;
    console.log('selectedCountry => ', selectedCountry);
    const country = this.countries.find((c: any) => c.name === selectedCountry);

    this.timezones = country ? country.timezones : [];
    console.log('timezones => ', this.timezones);

    this.scheduleForm.patchValue({
      timezone: '',
    });
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    this.successalertClass = '';
    setTimeout(() => {
      this.successMessage = '';
      this.successalertClass = 'd-none';
      this.ngOnInit();
    }, 5000);
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
    formData.append('episodeNo', this.episodeDetails.data.episodeNo);
    formData.append('seasonNo', this.episodeDetails.data.seasonNo);
    formData.append('slug', this.episodeDetails.data.description);
    formData.append('file', this.episodeDetails.data.file);
    formData.append('reason', '');
    formData.append('url', this.episodeDetails.data.url);
    formData.append('isBlock', this.episodeDetails.data.isBlock);
    formData.append('isApproved', this.episodeDetails.data.isApproved);
    formData.append('isPublished', this.episodeDetails.data.isPublished);
    return formData;
  }
}
