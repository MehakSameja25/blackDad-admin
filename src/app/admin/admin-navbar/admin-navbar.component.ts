import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MainNavService } from '../services/main-nav.service';
import { AuthanticationService } from '../services/authantication.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
})
export class AdminNavbarComponent implements OnInit {
  showCLass: string = '';
  styleDrop: string = '';
  displayClass: string = 'display: none';
  anchorClass: string = '';
  menuData: any;
  userId: any;
  userDetails: any;
  userType = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MainNavService,
    private authService: AuthanticationService,
    private notificationService: NotificationsService
  ) {
    this.userId = localStorage.getItem('userId');
    this.menuService.getMenu().subscribe((response: any) => {
      this.menuData = response.data[0];
      // console.log(this.menuData);
    });

    this.authService.getUserById(this.userId).subscribe((res: any) => {
      if (res) {
        this.userDetails = res.data;
        this.userType = res.data.role.name;
        // console.log(this.userType);
      }
    });
  }

  ngOnInit(): void {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.user-link')) {
      this.showCLass = '';
      this.styleDrop = '';
    }
  }

  profileDropdown() {
    if (this.showCLass === '') {
      this.showCLass = 'show';
      this.styleDrop =
        'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-29px, 125px);';
    } else {
      this.showCLass = '';
      this.styleDrop = '';
    }
  }

  showMembers() {
    if (this.displayClass === 'display: none') {
      this.displayClass = 'display: block';
      this.anchorClass = 'subdrop';
    } else {
      this.displayClass = 'display: none';
      this.anchorClass = '';
    }
  }

  routing(menu: any) {
    if (menu.menu_bar.title === 'Categories') {
      this.router.navigate(['/admin/categories']);
    } else if (menu.menu_bar.title === 'Episodes') {
      this.router.navigate(['/admin/episodes']);
    } else if (menu.menu_bar.title === 'Articles') {
      this.router.navigate(['/admin/articles']);
    }
    // console.log(menu.menu_bar.title);
  }

  isLinkActive(menu: any): boolean {
    const currentRoute = this.router.url;
    if (menu.menu_bar.title === 'Categories') {
      return currentRoute.includes('/admin/categories');
    } else if (menu.menu_bar.title === 'Episodes') {
      if (
        currentRoute.includes('/admin/episodes') ||
        currentRoute.includes('/admin/draft-episode') ||
        currentRoute.includes('/admin/scheduled-episodes') ||
        currentRoute.includes('/admin/edit-draft-episode') ||
        currentRoute.includes('/admin/add-episode') ||
        currentRoute.includes('/admin/detail-episode') ||
        currentRoute.includes('/admin/edit-episode')
      ) {
        return true;
      }
    } else if (menu.menu_bar.title === 'Articles') {
      if (
        currentRoute.includes('/admin/articles') ||
        currentRoute.includes('/admin/draft-article') ||
        currentRoute.includes('/admin/scheduled-articles') ||
        currentRoute.includes('/admin/edit-draft-article') ||
        currentRoute.includes('/admin/add-article') ||
        currentRoute.includes('/admin/detail-article') ||
        currentRoute.includes('/admin/edit-article')
      ) {
        return true;
      }
    }
    return false;
  }

  logOut() {
    localStorage.removeItem('nkt');
    this.notificationService.warn('Logging Out');
    setTimeout(() => {
      this.router.navigate(['/admin-auth']);
      this.notificationService.warn('Successfully Logged out');
    }, 3000);
  }
}
