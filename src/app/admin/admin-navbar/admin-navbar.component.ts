import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MainNavService } from '../services/main-nav.service';
import { AuthanticationService } from '../services/authantication.service';
import { NotificationsService } from 'angular2-notifications';
import { MainUser } from '../model/user.model';
import { Menu } from '../model/menu.model';
interface userDetails {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: null;
    password: string;
    text_password: null;
    remember_token: null;
    type: string;
    user_verification: string;
    isBlock: boolean;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  role: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}
@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
})
export class AdminNavbarComponent implements OnInit {
  showCLass: string = '';
  styleDrop: string = '';
  displayClass: string = 'display: none';
  anchorClass: string = '';
  menuData!: {
    role_accesses: [
      {
        id: number;
        status: string;
        created_at: string;
        updated_at: string;
        deleted_at: null | string;
        menu_id: number;
        role_type_id: number;
        menu_bar: {
          id: number;
          title: string;
          route: string;
          icon: string;
          is_parent: number;
          created_at: string;
          updated_at: string;
        };
      }
    ];
  };
  userId: string | null;
  userDetails!: userDetails;
  userType = '';
  constructor(
    private router: Router,
    private menuService: MainNavService,
    private authService: AuthanticationService,
    private notificationService: NotificationsService
  ) {
    this.userId = localStorage.getItem('userId');
    this.menuService.getMenu().subscribe((response: Menu) => {
      this.menuData = response.data[0];
      // console.log(this.menuData);
    });

    this.authService.getUserById(this.userId).subscribe((res: MainUser) => {
      if (res) {
        this.userDetails = res.data;
        this.userType = res.data.role.name;
        console.log(res);
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

  routing(menu: { menu_bar: { title: string } }) {
    if (menu.menu_bar.title === 'Categories') {
      this.router.navigate(['/admin/categories']);
    } else if (menu.menu_bar.title === 'Episodes') {
      this.router.navigate(['/admin/episodes']);
    } else if (menu.menu_bar.title === 'Articles') {
      this.router.navigate(['/admin/articles']);
    } else if (menu.menu_bar.title === 'Article Categories') {
      this.router.navigate(['/admin/artical-types']);
    }
    // console.log(menu.menu_bar.title);
  }

  isLinkActive(menu: { menu_bar: { title: string } }): boolean {
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
    localStorage.clear();
    this.notificationService.warn('Logging Out');
    setTimeout(() => {
      this.router.navigate(['/admin-auth']);
      this.notificationService.success('Successfully Logged out');
    }, 1500);
  }
}
