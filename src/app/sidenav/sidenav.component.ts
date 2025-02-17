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
  notificationCount: number = 3;
  constructor(private router: Router) {}

  toggleFiller() {
    this.showFiller = !this.showFiller;
  }
  navigateToConflicts() {
    this.router.navigate(['/conflict']);
  }
  navigateToProfs() {
    this.router.navigate(['/profs']);
  }
  navigateToRooms() {
    this.router.navigate(['/rooms']);
  }
  navigateToSchedule() {
    this.router.navigate(['/schedule']);
  }

  navigateToView() {
    this.router.navigate(['/view']);
  }

  navigateToGlobalSchedule() {
    this.router.navigate(['/global']);
  }
  navigateToRattrapage() {
    this.router.navigate(['/rattrapage']);
  }
  navigateToDashBoard() {
    this.router.navigate(['/professor']);
  }
}

