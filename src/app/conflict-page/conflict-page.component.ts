import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conflict-page',
  standalone: false,

  templateUrl: './conflict-page.component.html',
  styleUrl: './conflict-page.component.css'
})
export class ConflictPageComponent {
  showFiller = false;

  constructor(private router: Router) {}

  toggleFiller() {
    this.showFiller = !this.showFiller;
  }

  navigateToConflicts() {
    this.router.navigate(['/conflict']);
  }
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExtraText() {
    this.router.navigate(['/extra-text']);
  }

  navigateToAnotherPage() {
    this.router.navigate(['/another-page']);
  }
}

