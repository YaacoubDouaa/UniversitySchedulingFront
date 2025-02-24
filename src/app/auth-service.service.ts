import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  logout(currentSpace: 'admin' | 'professor') {
    // Clear any auth tokens or user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');

    // Navigate to the other space's login
    if (currentSpace === 'admin') {
      this.router.navigate(['/professor']);
    } else {
      this.router.navigate(['/adminSpace']);
    }
  }
}
