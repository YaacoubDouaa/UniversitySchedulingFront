import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Test users for development
  private validUsers = [
    { username: 'admin1', password: 'admin123', role: 'ADMIN' },
    { username: 'prof1', password: 'prof123', role: 'PROFESSOR' },
    { username: 'student1', password: 'student123', role: 'STUDENT' },
    { username: 'tech1', password: 'tech123', role: 'TECHNICIAN' },
    { username: 'YaacoubDouaa', password: 'password123', role: 'PROFESSOR' }
  ];

  private isLoggedIn = false;
  private userRole: string | null = null;
  private username: string | null = null;

  constructor(private router: Router) {
    console.log('AuthService instantiated - CORRECT VERSION WITH TEST USERS');

    // Restore auth state from localStorage
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');

    console.log('AuthService initialized:', {
      isLoggedIn: this.isLoggedIn,
      userRole: this.userRole,
      username: this.username
    });
  }

  login(username: string, password: string, role: string): Observable<boolean> {
    console.log('Attempting login:', { username, role });

    // Check credentials against valid users
    const success = this.validUsers.some(user =>
      user.username === username &&
      user.password === password &&
      user.role === role
    );

    if (success) {
      console.log('Login successful');
      this.setAuthState(username, role);

      // Navigate to home route after successful login
      setTimeout(() => {
        this.router.navigate([this.getHomeRoute()]);
      }, 100);
    } else {
      console.log('Login failed - Invalid credentials');
    }

    return of(success).pipe(
      delay(1000),
      tap(() => console.log('Login process completed'))
    );
  }

  logout(): void {
    console.log('Logging out user');
    this.isLoggedIn = false;
    this.userRole = null;
    this.username = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    // Check both memory state and localStorage
    const authState = this.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
    console.log('Checking if user is authenticated:', authState);
    return authState;
  }

  getUserRole(): string | null {
    return this.userRole || localStorage.getItem('userRole');
  }

  getUsername(): string | null {
    return this.username || localStorage.getItem('username');
  }

  getHomeRoute(): string {
    const role = this.getUserRole();
    console.log('Determining home route based on role:', role);
    switch(role) {
      case 'ADMIN': return '/admin';
      case 'PROFESSOR': return '/professor';
      case 'STUDENT': return '/student';
      case 'TECHNICIAN': return '/technician';
      default: return '/login';
    }
  }

  private setAuthState(username: string, role: string): void {
    this.isLoggedIn = true;
    this.userRole = role;
    this.username = username;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);

    console.log('Auth state set:', {
      isLoggedIn: this.isLoggedIn,
      userRole: this.userRole,
      username: this.username
    });
  }
}
