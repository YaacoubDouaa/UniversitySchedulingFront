import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css'],
  standalone:false
})
export class ProfessorDashboardComponent implements OnInit {
  upcomingClasses = [
    { name: 'Mathematics 101', time: '10:00 AM', room: 'A-101' },
    { name: 'Physics 202', time: '2:00 PM', room: 'B-203' },
  ];

  pendingProposals = [
    { name: 'Chemistry 301', date: '2023-06-15', status: 'Pending' },
    { name: 'Biology 102', date: '2023-06-18', status: 'Pending' },
  ];

  constructor() { }

  ngOnInit(): void { }
}
