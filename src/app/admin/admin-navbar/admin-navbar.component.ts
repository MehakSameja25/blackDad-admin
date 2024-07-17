import { Component, HostListener, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MainNavService } from '../services/main-nav.service';
import { AuthanticationService } from '../services/authantication.service';

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
    private route: Router,
    private menuService: MainNavService,
    private authService: AuthanticationService
  ) {
    this.userId = localStorage.getItem('userId');
    this.menuService.getMenu().subscribe((response: any) => {
      this.menuData = response.data[0];
      console.log(this.menuData);
    });

    this.authService.getUserById(this.userId).subscribe((res: any) => {
      if (res) {
        this.userDetails = res.data;
        this.userType = res.data.role.name;
        console.log(this.userType);
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
      this.route.navigate(['/admin/categories']);
    } else if (menu.menu_bar.title === 'Episodes') {
      this.route.navigate(['/admin/episodes']);
    } else if (menu.menu_bar.title === 'Articles') {
      this.route.navigate(['/admin/articles']);
    }
    console.log(menu.menu_bar.title);
  }

  checkActiveEpisodes() {
    const url = this.route.url;
    if (
      url.includes('admin/episodes') ||
      url.includes('admin/edit-episode') ||
      url.includes('admin/add-episode')
    ) {
      return 'active';
    } else {
      return '';
    }
  }

  logOut() {
    localStorage.removeItem('nkt');

    setTimeout(() => {
      this.route.navigate(['/admin-auth']);
    }, 1000);
  }
}
