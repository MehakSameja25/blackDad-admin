import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private route: ActivatedRoute,
    private postsService: AllPostsService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.postsService.getEpisodeDetails(id).subscribe((response) => {
      this.episodeDetails = response;
      if (this.episodeDetails?.data?.description) {
        this.sanitizedDescription = this.sanitizeDescription(
          this.episodeDetails.data.description
        );
        console.log('CALLLED');
      }
    });
  }
  isLoading = true;

  onImageLoad() {
    this.isLoading = false;
  }
  open(content: any, post: any) {
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
            setTimeout(() => {
              this.successMessage = 'Episode Approved';
              this.successalertClass = '';
              this.ngOnInit();
            }, 1000);
            setTimeout(() => {
              this.successMessage = '';
              this.successalertClass = 'd-none';
            }, 5000);
          } else if (approve == 2) {
            setTimeout(() => {
              this.successMessage = 'Episode Rejected';
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

  publish(episodeData: any, type: any) {
    this.postsService
      .updateIsPublished(episodeData.id, type)
      .subscribe((res) => {
        if (res) {
          setTimeout(() => {
            this.successMessage = 'Episode Published';
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
