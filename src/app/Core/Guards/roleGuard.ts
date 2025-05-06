import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {AuthService} from '../../auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Array<string>;
    console.log('RoleGuard checking role access...', allowedRoles);

    const userRole = this.authService.getUserRole();
    console.log('User role:', userRole);

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('User does not have required role. Access denied.');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('User has required role. Access granted.');
    return true;
  }
}
