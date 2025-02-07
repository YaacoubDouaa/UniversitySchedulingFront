import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: false,

  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  showFiller = false;

  constructor(private router: Router) {}

  toggleFiller() {
    this.showFiller = !this.showFiller;
  }

  navigateToConflicts() {
    this.router.navigate(['/conflict']);
  }

  navigateToExtraText() {
    this.router.navigate(['/extra-text']);
  }

  navigateToAnotherPage() {
    this.router.navigate(['/another-page']);
  }
}

