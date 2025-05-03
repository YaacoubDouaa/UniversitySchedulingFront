import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../auth-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],standalone:false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  roles = [
    { id: 'administrator', name: 'Administrateur' },
    { id: 'technicien', name: 'Technicien' },
    { id: 'professor', name: 'Enseignant' },
    { id: 'student', name: 'Étudiant' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.navigateByRole(this.authService.getUserRole());
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password, role } = this.loginForm.value;

    this.authService.login(username, password, role)
      .subscribe({
        next: (success: any) => {
          if (success) {
            this.navigateByRole(role);
          } else {
            this.errorMessage = 'Identifiants incorrects';
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Une erreur est survenue lors de la connexion';
          console.error('Login error:', error);
          this.isLoading = false;
        }
      });
  }

  navigateByRole(role: string): void {
    switch (role) {
      case 'administrator':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'technicien':
        this.router.navigate(['/technicien/dashboard']);
        break;
      case 'professor':
        this.router.navigate(['/enseignant/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/etudiant/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
