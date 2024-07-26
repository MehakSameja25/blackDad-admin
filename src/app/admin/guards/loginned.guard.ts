import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthanticationService } from '../services/authantication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class loginnedGuard implements CanActivate {
  constructor(
    private authService: AuthanticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const url: string = state.url;

    if (isAuthenticated && url === '/admin-auth') {
      this.router.navigate(['/admin/profile']);
      return false;
    } else {
      this.router.navigate(['/']);
    }

    return true;
  }
}
