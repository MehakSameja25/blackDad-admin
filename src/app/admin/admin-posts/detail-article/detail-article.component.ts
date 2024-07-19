import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { AuthanticationService } from '../../services/authantication.service';
import { MainNavService } from '../../services/main-nav.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES } from '../../countries';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
})
export class DetailArticleComponent {
  articleDetails: any;
  sanitizedDescription: SafeHtml | undefined;
  successalertClass: any = 'd-none';
  successMessage: any = '';
  publishPermission: any;
  type: any;
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
    const id = this.route.snapshot.paramMap.get('id');
    this.postsService.getArticlesDetails(id).subscribe((response) => {
      this.articleDetails = response;
      if (this.articleDetails?.data?.description) {
        this.sanitizedDescription = this.sanitizeDescription(
          this.articleDetails.data.description
        );
        console.log('CALLLED');
      }
    });

    this.checkPermission();
  }

  sanitizeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }
  approved(articleData: any, type: any, approve: any) {
    this.postsService
      .updateIsApproved(articleData.id, type, approve)
      .subscribe((res) => {
        if (res) {
          if (approve == 1) {
            setTimeout(() => {
              this.successMessage = 'Article Approved';
              this.successalertClass = '';
              this.ngOnInit();
            }, 1000);
            setTimeout(() => {
              this.successMessage = '';
              this.successalertClass = 'd-none';
            }, 5000);
          } else if (approve == 2) {
            setTimeout(() => {
              this.successMessage = 'Article Rejected';
              this.successalertClass = '';
              this.ngOnInit();
            }, 1000);
            setTimeout(() => {
              this.successMessage = '';
              this.successalertClass = 'd-none';
            }, 5000);
          }
        }
      });
  }

  publish(articleData: any, type: any) {
    this.postsService
      .updateIsPublished(articleData.id, type)
      .subscribe((res) => {
        if (res) {
          setTimeout(() => {
            this.successMessage = 'Article Published';
            this.successalertClass = '';
            this.ngOnInit();
          }, 1000);
          setTimeout(() => {
            this.successMessage = '';
            this.successalertClass = 'd-none';
          }, 5000);
        }
      });
  }

  checkPermission() {
    const userId = localStorage.getItem('userId');
    this.authService.getUserById(userId).subscribe((res) => {
      this.type = res.data.role.name;
    });
    this.navService.getMenu().subscribe((res: any) => {
      for (let permission of res.data[0].role_accesses) {
        if ((permission.menu_bar.title == 'Articles') === true) {
          this.publishPermission = permission.status.includes('publish');

          //  console check
          console.log('publish permission', this.publishPermission);
        }
      }
    });
  }
  scheduleForm!: FormGroup;
  countries: any = COUNTRIES;

  timezones: any[] = [];
  openScheduleModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  schedule() {
    if (this.scheduleForm.valid) {
      const body = {
        country: this.scheduleForm.value.country,

        timezone: this.scheduleForm.value.timezone,
        publish_date: this.scheduleForm.value.scheduled_at,
        is_scheduled: 'scheduled',
      };
      console.log('Scheduled At:', body);
      this.modalService.dismissAll();
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
}
