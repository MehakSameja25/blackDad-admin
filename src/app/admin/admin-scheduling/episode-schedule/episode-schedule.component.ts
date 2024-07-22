import { Component, OnInit } from '@angular/core';
import { MainNavService } from '../../services/main-nav.service';
import { AllPostsService } from '../../services/all-posts.service';

@Component({
  selector: 'app-episode-schedule',
  templateUrl: './episode-schedule.component.html',
  styleUrls: ['./episode-schedule.component.css'],
})
export class EpisodeScheduleComponent implements OnInit {
  addPermission: any;
  editPermission: any;
  isEdit: any;
  isEditAfterPublish: any;
  deletePermission: any;
  body: any;

  constructor(
    private navService: MainNavService,
    private postsService: AllPostsService
  ) {}
  ngOnInit(): void {
    this.checkPermissions();
    this.body = {
      is_scheduled: 'scheduled',
    };
    this.postsService.getEpisodes(this.body).subscribe((response) => {
      console.log(response);
    });
  }
  checkPermissions() {
    this.navService.getMenu().subscribe((res: any) => {
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Episodes') === true) {
            this.addPermission = permission.status.includes('add');
            this.isEdit = permission.status.includes('edit');
            this.isEditAfterPublish =
              permission.status.includes('edit after publish');
            this.deletePermission = permission.status.includes('delete');
            //  console check
            console.log('add permission', this.addPermission);
            console.log('delete permission', this.deletePermission);
            console.log('edit permission', this.isEdit);
            console.log(
              'edit after publish permission',
              this.isEditAfterPublish
            );
          }
        }
      }
    });
  }

  isEditPermission(episode: any) {
    // console.log(episode);
    if (this.isEdit == true && this.isEditAfterPublish == true) {
      return true;
    } else if (this.isEdit && episode.isPublished == 0) {
      return true;
    } else {
      return false;
    }
  }
}
