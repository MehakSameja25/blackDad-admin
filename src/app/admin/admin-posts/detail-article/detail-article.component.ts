import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
})
export class DetailArticleComponent {
  articleDetails: any;
  sanitizedDescription: SafeHtml | undefined;
  successalertClass: any = 'd-none';
  successMessage: any = '';
  constructor(
    private route: ActivatedRoute,
    private postsService: AllPostsService,
    private sanitizer: DomSanitizer
  ) {}

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
}
