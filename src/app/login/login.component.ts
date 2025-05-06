import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import {MatCard} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false; // Not isLoading
  errorMessage = '';
  roles = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'TECHNICIAN', label: 'Technician' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['ADMIN', [Validators.required]]
    });

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getHomeRoute()]);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password, role } = this.loginForm.value;

    this.authService.login(username, password, role)
      .subscribe({
        next: (success) => {
          this.loading = false;
          if (!success) {
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
          // Navigation handled in service
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'An error occurred. Please try again later.';
          console.error('Login error:', error);
        }
      });
  }

  // Helper for form field validation
  get f() {
    return this.loginForm.controls;
  }
}
