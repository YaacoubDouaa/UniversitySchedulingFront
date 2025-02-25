import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // BehaviorSubject to hold the current professor's ID as a string
  private currentProfessorIdSubject = new BehaviorSubject<string>('101'); // Initialize with YaacoubDouaa's ID

  // Observable that converts the string ID to a number for subscribers
  // Uses RxJS pipe and map to transform the value
  currentProfessorId$ = this.currentProfessorIdSubject.asObservable().pipe(
    map(id => parseInt(id, 10))
  );

  // Current user information
  private currentUserSubject = new BehaviorSubject<{
    id: string;
    login: string;
    lastLoginTime: string;
  }>({
    id: '101',
    login: 'YaacoubDouaa',
    lastLoginTime: '2025-02-24 15:41:28'
  });

  // Observable for current user information
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check localStorage for existing professor ID on service initialization
    const storedId = localStorage.getItem('currentProfessorId');
    if (storedId) {
      this.currentProfessorIdSubject.next(storedId);
    } else {
      // If no stored ID, initialize with default
      this.setCurrentProfessorId('101');
    }

    // Initialize user data in localStorage if not present
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: '101',
        login: 'YaacoubDouaa',
        lastLoginTime: '2025-02-24 15:41:28'
      }));
    }
  }

  /**
   * Sets the current professor's ID
   * @param id - The professor's ID (can be number or string)
   * Stores in localStorage and updates the BehaviorSubject
   */
  setCurrentProfessorId(id: number | string): void {
    const stringId = id.toString();
    localStorage.setItem('currentProfessorId', stringId);
    this.currentProfessorIdSubject.next(stringId);
  }

  /**
   * Gets the current professor's ID as a number
   * @returns number - The current professor's ID
   * Parses the stored string ID to a number
   */
  getCurrentProfessorId(): number {
    return parseInt(this.currentProfessorIdSubject.value, 10);
  }

  /**
   * Clears the current professor's ID
   * Removes from localStorage and resets the BehaviorSubject
   */
  clearCurrentProfessorId(): void {
    localStorage.removeItem('currentProfessorId');
    this.currentProfessorIdSubject.next('');
  }

  /**
   * Gets the current user's login name
   * @returns string - The current user's login
   */
  getCurrentUserLogin(): string {
    return this.currentUserSubject.value.login;
  }

  /**
   * Gets the current user's last login time
   * @returns string - The last login time in YYYY-MM-DD HH:MM:SS format
   */
  getCurrentUserLastLoginTime(): string {
    return this.currentUserSubject.value.lastLoginTime;
  }

  /**
   * Updates the current user's information
   * @param userData - Object containing user information
   */
  updateCurrentUser(userData: { id: string; login: string; lastLoginTime: string }): void {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  /**
   * Checks if a user is currently logged in
   * @returns boolean - True if a user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value.id;
  }

  /**
   * Logs out the current user
   * Clears all stored user data
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentProfessorId');
    this.currentProfessorIdSubject.next('');
    this.currentUserSubject.next({
      id: '',
      login: '',
      lastLoginTime: ''
    });
  }
}
