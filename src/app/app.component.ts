import { Component } from '@angular/core';
import {Schedule} from './models/Schedule';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UniversitySchedulingFront';
  isSidebarOpen = true;
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
