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
  displayClass2: string = 'display: none';
  anchorClass2: string = '';
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
  userDetails!: userDetails;
  userType = '';
  userRole: any;
  user: any;
  constructor(
    private router: Router,
    private menuService: MainNavService,
    private authService: AuthanticationService,
    private notificationService: NotificationsService
  ) {
    this.authService.getUserById().subscribe((res: MainUser) => {
      if (res) {
        this.userDetails = res.data;
        this.userRole = res.data?.role;
        this.user = res.data?.user;
        this.userType = res.data?.role?.name;
        if (this.user.type !== 'manufacturer') {
          this.getMenu();
        }
      }
    });
  }

  getMenu() {
    this.menuService.getMenu().subscribe((response: Menu) => {
      this.menuData = response.data[0];
    });
  }

  ngOnInit(): void {
    this.checkEcommerceMenuState();
  }

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

  showEcom() {
    if (this.displayClass2 === 'display: none') {
      this.displayClass2 = 'display: block';
      this.anchorClass2 = 'subdrop';
    } else {
      this.displayClass2 = 'display: none';
      this.anchorClass2 = '';
    }
  }

  private ecommerceRoutes: string[] = [
    '/admin/dashboard',
    '/admin/all-orders',
    '/manufacturers',
    '/admin/manufecturer/roles',
    '/admin/manufecturer/role/assigning',
    '/products',
    '/product/categories',
  ];

  private checkEcommerceMenuState() {
    const currentUrl = this.router.url;
    if (this.ecommerceRoutes.some((route) => currentUrl.includes(route))) {
      this.displayClass2 = 'display: block';
      this.anchorClass2 = 'subdrop';
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
    } else if (menu.menu_bar.title === 'Product') {
      this.router.navigate(['/products']);
    } else if (menu.menu_bar.title === 'All Manufacturer') {
      this.router.navigate(['/manufacturers']);
    } else if (menu.menu_bar.title === 'Product Categories') {
      this.router.navigate(['/product/categories']);
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

  getSubDropClass(): string {
    const currentUrl = this.router.url;
    const subLinks = [
      '/admin/all-members',
      '/admin/add-member',
      '/admin/role-type',
      '/admin/add-role',
      '/admin/assign-role',
    ];

    const isActive = subLinks.some((link) => currentUrl.includes(link));
    return isActive ? 'd-block' : '';
  }

  getClass(): string {
    const currentUrl = this.router.url;
    const subLinks = [
      '/admin/all-members',
      '/admin/add-member',
      '/admin/role-type',
      '/admin/add-role',
      '/admin/assign-role',
    ];

    const isActive = subLinks.some((link) => currentUrl.includes(link));
    return isActive ? 'subdrop' : '';
  }

  logOut() {
    localStorage.clear();
    this.notificationService.warn('Logging Out');
    setTimeout(() => {
      this.router.navigate(['/admin-auth']);
      this.notificationService.success('Successfully Logged out');
    }, 1500);
  }

  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(event: MouseEvent) {
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
      this.isSidebarOpen = false;
    }
  }
}
