import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {AuthService} from '../../auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Get allowed roles from route data
    const allowedRoles = route.data['roles'] as Array<string>;

    // Check if user has any of the required roles
    if (this.authService.isAuthenticated() && this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // If user is authenticated but doesn't have the correct role,
    // redirect to unauthorized page
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/unauthorized']);
    } else {
      // If user is not authenticated, the AuthGuard should handle this
      this.router.navigate(['/login']);
    }

    return false;
  }
}
