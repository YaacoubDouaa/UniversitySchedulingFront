import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {
  private isLoggedIn = false;
  private currentUserRole: string | null = null;

  constructor() { }

  login(username: string, password: string, role: string): Observable<boolean> {
    // Simulate API call
    const validCredentials = this.validateCredentials(username, password, role);

    if (validCredentials) {
      this.isLoggedIn = true;
      this.currentUserRole = role;
      // Store in localStorage to simulate persistence
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
    }

    return of(validCredentials).pipe(delay(1500)); // Simulate network delay
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUserRole = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    // Check localStorage for persistence across page reloads
    return this.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }

  getHomeRoute(): string {
    const role = this.currentUserRole || localStorage.getItem('userRole');
    switch(role) {
      case 'ADMIN': return '/admin';
      case 'PROFESSOR': return '/professor';
      case 'STUDENT': return '/student';
      case 'TECHNICIAN': return '/technician';
      default: return '/';
    }
  }

  // Simulate credential validation
  private validateCredentials(username: string, password: string, role: string): boolean {
    const validUsers = [
      { username: 'admin1', password: 'admin123', role: 'ADMIN' },
      { username: 'prof1', password: 'prof123', role: 'PROFESSOR' },
      { username: 'student1', password: 'student123', role: 'STUDENT' },
      { username: 'tech1', password: 'tech123', role: 'TECHNICIAN' },
      { username: 'YaacoubDouaa', password: 'password123', role: 'PROFESSOR' }
    ];

    return validUsers.some(user =>
      user.username === username &&
      user.password === password &&
      user.role === role
    );
  }
}
