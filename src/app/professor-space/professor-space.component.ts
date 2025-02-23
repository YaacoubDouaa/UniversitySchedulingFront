import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProfessorsService} from '../professors.service';


@Component({
  selector: 'app-professor-space',
  templateUrl: './professor-space.component.html',
  standalone:false
})
export class ProfessorSpaceComponent implements OnInit {
  isOpen = true;
  currentDateTime = '2025-02-23 23:24:03';
  currentUser = 'YaacoubDouaa';
  isMobileMenuOpen = false;

  navItems = [
    { route: 'profdashboard', label: 'Dashboard', icon: 'home' },
    { route: 'profschedule', label: 'My Schedule', icon: 'calendar' },
    { route: 'propose-rattrapage', label: 'Make-up Sessions', icon: 'clock' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' }
  ];

  constructor(
    private router: Router,
    private professorService: ProfessorsService
  ) {}

  ngOnInit(): void {
    this.updateDateTime();
  }

  private updateDateTime(): void {
    setInterval(() => {
      this.currentDateTime = new Date()
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
    }, 1000);
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
