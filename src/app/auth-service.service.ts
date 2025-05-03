import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ROLE = 'user_role';
  private readonly USER_DATA = 'user_data';

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string, role: string): Observable<boolean> {
    // In a real application, you would send a request to your API
    // For now, we'll simulate a successful login for demo purposes

    // Simulated API call
    return of(true).pipe(
      tap(() => {
        // Store user info in localStorage upon successful login
        localStorage.setItem(this.TOKEN_KEY, 'demo-token-123456');
        localStorage.setItem(this.USER_ROLE, role);
        localStorage.setItem(this.USER_DATA, JSON.stringify({
          username,
          role,
          id: '12345',
          name: username // In a real app, you'd get the full name from the API
        }));
      })
    );

    // For real API implementation, uncomment and adapt this code
    /*
    return this.http.post<any>('your-api-url/auth/login', { username, password, role }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_ROLE, role);
          localStorage.setItem(this.USER_DATA, JSON.stringify(response.user));
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
    */
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE);
    localStorage.removeItem(this.USER_DATA);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string {
    return localStorage.getItem(this.USER_ROLE) || '';
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
}
