import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

// Current Date and Time: 2025-05-04 18:38:36
// Author: YaacoubDouaa

// Environment configuration
const API_URL = 'http://localhost:8080/api'; // Replace with your actual API URL

export interface Personne {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  adresse: string;
  signalIds: number[];
}

export interface User {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'away';
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  personne?: Personne;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private readonly PERSONNE_KEY = 'current_personne';
  private readonly ROLES_KEY = 'user_roles';

  // Store the target URL for redirection after login
  redirectUrl: string | null = null;

  // User observables
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Personne observables
  private currentPersonneSubject: BehaviorSubject<Personne | null>;
  public currentPersonne$: Observable<Personne | null>;

  // Roles observable
  private userRolesSubject: BehaviorSubject<string[]>;
  public userRoles$: Observable<string[]>;

  // Status timer for "away" detection
  private activityTimer: any;
  private readonly AWAY_TIMEOUT = 10 * 60 * 1000; // 10 minutes of inactivity

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize behavior subjects
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.currentPersonneSubject = new BehaviorSubject<Personne | null>(this.getPersonneFromStorage());
    this.currentPersonne$ = this.currentPersonneSubject.asObservable();

    this.userRolesSubject = new BehaviorSubject<string[]>(this.getRolesFromStorage());
    this.userRoles$ = this.userRolesSubject.asObservable();

    // Setup user activity monitoring for status updates
    this.setupActivityMonitoring();

    // Initialize authentication from stored data
    this.initializeAuthFromStorage();

    // Log initialization
    console.log(`Auth service initialized at ${new Date().toISOString()}`);
  }

  /**
   * Get the current authenticated user
   */
  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get the current personne details
   */
  public get currentPersonne(): Personne | null {
    return this.currentPersonneSubject.value;
  }

  /**
   * Get current user roles
   */
  public get userRoles(): string[] {
    return this.userRolesSubject.value || [];
  }

  /**
   * Check if user is authenticated (alias for isLoggedIn for compatibility)
   */
  public isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get user's main role (for compatibility with existing code)
   */
  public getUserRole(): string {
    const roles = this.userRoles;
    return roles && roles.length > 0 ? roles[0] : '';
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = this.parseJwt(token);
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return false;
    }
  }

  /**
   * Parse JWT token without external library
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return {};
    }
  }

  /**
   * Check if user has a specific role
   */
  public hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Login with username and password
   * @param email User's email
   * @param password User's password
   * @param role Optional role parameter (for compatibility)
   */
  public login(email: string, password: string, role?: string): Observable<boolean> {
    // We ignore the role parameter to fix the parameter count error
    const payload = { email, password };

    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, payload)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(() => true),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  /**
   * Register a new user
   */
  public register(registrationData: Partial<Personne>): Observable<boolean> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, registrationData)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(() => true),
        catchError(error => {
          console.error('Registration error:', error);
          return of(false);
        })
      );
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    // Notify the backend about logout (if required)
    if (this.isAuthenticated()) {
      this.http.post(`${API_URL}/auth/logout`, {})
        .pipe(
          finalize(() => {
            this.clearAuthData();
            this.router.navigate(['/login']);
          }),
          catchError(error => {
            console.error('Logout error:', error);
            return of(null);
          })
        ).subscribe();
    } else {
      this.clearAuthData();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PERSONNE_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    // Clear behavior subjects
    this.currentUserSubject.next(null);
    this.currentPersonneSubject.next(null);
    this.userRolesSubject.next([]);

    // Clear activity timer
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    console.log('Auth data cleared');
  }

  /**
   * Update user status
   */
  public updateStatus(status: 'online' | 'offline' | 'away'): Observable<User> {
    if (!this.currentUser) {
      return of(null as any);
    }

    const updatedUser: User = {
      ...this.currentUser,
      status
    };

    return this.http.put<User>(`${API_URL}/users/${this.currentUser.id}/status`, { status })
      .pipe(
        tap(() => {
          // Update local storage and behavior subject
          this.storeUserInStorage(updatedUser);
          this.currentUserSubject.next(updatedUser);
        }),
        catchError(error => {
          console.error('Status update error:', error);
          return of(this.currentUser as User);
        })
      );
  }

  /**
   * Refresh the authentication token
   */
  public refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return of(false);
    }

    return this.http.post<AuthResponse>(`${API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(() => true),
        catchError(error => {
          console.error('Token refresh error:', error);
          // If refresh fails, logout
          this.clearAuthData();
          return of(false);
        })
      );
  }

  /**
   * Update user profile
   */
  public updateProfile(personneData: Partial<Personne>): Observable<Personne> {
    if (!this.currentPersonne) {
      return of(null as any);
    }

    return this.http.put<Personne>(`${API_URL}/personnes/${this.currentPersonne.id}`, personneData)
      .pipe(
        tap(updatedPersonne => {
          // Update local storage and behavior subject
          this.storePersonneInStorage(updatedPersonne);
          this.currentPersonneSubject.next(updatedPersonne);
        }),
        catchError(error => {
          console.error('Profile update error:', error);
          return of(this.currentPersonne as Personne);
        })
      );
  }

  /**
   * Change password
   */
  public changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<{success: boolean}>(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Password change error:', error);
        return of(false);
      })
    );
  }

  /**
   * Request password reset
   */
  public requestPasswordReset(email: string): Observable<boolean> {
    return this.http.post<{success: boolean}>(`${API_URL}/auth/request-reset`, { email })
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error('Password reset request error:', error);
          return of(false);
        })
      );
  }

  /**
   * Reset password with token
   */
  public resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.http.post<{success: boolean}>(`${API_URL}/auth/reset-password`, {
      token,
      newPassword
    }).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Password reset error:', error);
        return of(false);
      })
    );
  }

  /**
   * Get authentication token
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get the home route based on user role
   */
  public getHomeRoute(): string {
    const roles = this.userRoles;

    if (roles.includes('ADMIN')) {
      return '/admin';
    } else if (roles.includes('PROFESSOR')) {
      return '/professor';
    } else if (roles.includes('STUDENT')) {
      return '/student';
    } else if (roles.includes('TECHNICIAN')) {
      return '/technician';
    }

    return '/';
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    if (!response || !response.token) {
      return;
    }

    // Store tokens
    localStorage.setItem(this.TOKEN_KEY, response.token);
    if (response.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }

    // Store user data
    if (response.user) {
      this.storeUserInStorage(response.user);
      this.currentUserSubject.next(response.user);
    }

    // Store personne data
    if (response.personne) {
      this.storePersonneInStorage(response.personne);
      this.currentPersonneSubject.next(response.personne);
    }

    // Store roles
    if (response.roles) {
      localStorage.setItem(this.ROLES_KEY, JSON.stringify(response.roles));
      this.userRolesSubject.next(response.roles);
    } else {
      // Extract roles from JWT if not explicitly provided
      try {
        const payload = this.parseJwt(response.token);
        const roles = payload.roles || [];
        localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
        this.userRolesSubject.next(roles);
      } catch (e) {
        console.error('Error decoding JWT token:', e);
        this.userRolesSubject.next([]);
      }
    }

    // Set user as online
    if (response.user) {
      this.updateStatus('online').subscribe();
    }
  }

  /**
   * Initialize authentication from stored data
   */
  private initializeAuthFromStorage(): void {
    if (this.isAuthenticated()) {
      const user = this.getUserFromStorage();
      const personne = this.getPersonneFromStorage();
      const roles = this.getRolesFromStorage();

      if (user) {
        this.currentUserSubject.next(user);

        // Start with online status after page reload
        if (user.status !== 'online') {
          this.updateStatus('online').subscribe();
        }
      }

      if (personne) {
        this.currentPersonneSubject.next(personne);
      }

      this.userRolesSubject.next(roles);
    } else {
      // Clear any stale data
      this.clearAuthData();
    }
  }

  /**
   * Store user in local storage
   */
  private storeUserInStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Store personne in local storage
   */
  private storePersonneInStorage(personne: Personne): void {
    localStorage.setItem(this.PERSONNE_KEY, JSON.stringify(personne));
  }

  /**
   * Get user from local storage
   */
  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data from storage:', e);
      return null;
    }
  }

  /**
   * Get personne from local storage
   */
  private getPersonneFromStorage(): Personne | null {
    const personneData = localStorage.getItem(this.PERSONNE_KEY);
    try {
      return personneData ? JSON.parse(personneData) : null;
    } catch (e) {
      console.error('Error parsing personne data from storage:', e);
      return null;
    }
  }

  /**
   * Get roles from local storage
   */
  private getRolesFromStorage(): string[] {
    const rolesData = localStorage.getItem(this.ROLES_KEY);
    try {
      return rolesData ? JSON.parse(rolesData) : [];
    } catch (e) {
      console.error('Error parsing roles data from storage:', e);
      return [];
    }
  }

  /**
   * Setup activity monitoring for user status
   */
  private setupActivityMonitoring(): void {
    // Reset timer on user activity
    const resetTimer = () => {
      if (this.activityTimer) {
        clearTimeout(this.activityTimer);
      }

      // If user is authenticated and online, set a timer to change status to 'away'
      if (this.isAuthenticated() && this.currentUser?.status === 'online') {
        this.activityTimer = setTimeout(() => {
          this.updateStatus('away').subscribe();
        }, this.AWAY_TIMEOUT);
      }
    };

    // Monitor user activity
    if (typeof window !== 'undefined') {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, resetTimer, { passive: true });
      });
    }

    // Initial timer setup
    resetTimer();
  }

  /**
   * Get full name from current personne
   */
  public getFullName(): string {
    const personne = this.currentPersonne;
    if (personne) {
      return `${personne.prenom} ${personne.nom}`;
    }
    return this.currentUser?.name || '';
  }

  /**
   * Check if user has pending signals
   */
  public hasPendingSignals(): boolean {
    return !!this.currentPersonne?.signalIds && this.currentPersonne.signalIds.length > 0;
  }

  /**
   * Get number of pending signals
   */
  public getPendingSignalsCount(): number {
    return this.currentPersonne?.signalIds?.length || 0;
  }
}
