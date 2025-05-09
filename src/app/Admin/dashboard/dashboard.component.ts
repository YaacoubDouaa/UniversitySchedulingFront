import { Component, Injector, OnInit } from '@angular/core';
import { RattrapageSchedule, Schedule } from '../../models/Schedule';
import { SeanceConflict } from '../../models/Seance';
import { ScheduleService } from '../../Services/ScheduleService/schedule-service.service';
import { ConflictService } from '../../Services/ConflictService/conflict.service';
import { RattrapageService } from '../../Services/PropositionDeRattrapageService/rattrapage.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {interval, Subject, takeUntil} from 'rxjs';
import {ProfessorsService} from '../../Services/ProfessorSevice/professors.service';
import {demoSchedule} from '../../initialData/initialData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})

export class DashboardComponent implements OnInit {
  displayText = '';
  fullText = 'Welcome to Schedule Manager';
  isSidebarOpen = true;
  schedule: Schedule = demoSchedule;
  conflicts: SeanceConflict[] = [];
  rattrapageSchedule: RattrapageSchedule = {};
  selectedNiveau: string = 'ALL';
  currentDay: string;
  groupOptions: string[] = ['ING1_INFO','ING1_INFO_TD1', 'ING1_INFO_TD2','ING1_INFO_TD1 || ING1_INFO_TD2'];
  timeSlots: string[] = [
    '08:30-10:00', '10:15-11:45', '12:00-13:30',
    '13:45-15:15', '15:30-17:00', '17:15-18:45'
  ];
  appJson: String = "aaaa";

  constructor(private injector: Injector,private professorsService: ProfessorsService,
              ) {
    this.currentDay = this.getCurrentDay();
    // Start auto-sliding
    this.startAutoSlide();
  }

  ngOnInit(): void {
    this.loadSchedule();
    this.loadConflicts();
    this.loadRattrapageSchedule();
    this.animateText();
    this.loadStats();
  }
  private animateText() {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayText = this.fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
  private getCurrentDay(): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return days[new Date().getDay()];
  }

  isLoading: boolean = true;
  error: string | null = null;

  private loadSchedule(): void {
    this.isLoading = true;
    const scheduleService = this.injector.get(ScheduleService);
    scheduleService.getSchedule().subscribe({
      next: (schedule: Schedule) => {
        this.schedule = schedule;
        this.isLoading = false;
        // Debug logs
        console.log('Current Day:', this.currentDay);
        console.log('Full Schedule:', this.schedule);
        if (this.schedule[this.currentDay]) {
          Object.keys(this.schedule[this.currentDay]).forEach(niveau => {
            console.log(`Seances for ${niveau}:`, this.schedule[this.currentDay][niveau]);
          });
        }
      },
      error: (err) => {
        this.error = 'Failed to load schedule';
        this.isLoading = false;
        console.error('Error loading schedule:', err);
      }
    });
  }
  // Add helper method to get available niveaux
  getNiveauxForCurrentDay(): string[] {
    if (this.schedule && this.schedule[this.currentDay]) {
      return Object.keys(this.schedule[this.currentDay]);
    }
    return [];
  }

  private loadConflicts(): void {
    // Lazy injection of the ConflictService
    const conflictService = this.injector.get(ConflictService);
    conflictService.getConflicts().subscribe(
      (data) => {
        this.conflicts = data;
        console.log(this.conflicts); // Just to confirm it's working
      }
    );
  }

  private loadRattrapageSchedule(): void {
    // Lazy injection of the RattrapageService
    const rattrapageService = this.injector.get(RattrapageService);
    rattrapageService.getRattrapageSchedule().subscribe(
      (data) => {
        this.rattrapageSchedule = data;
        console.log(this.rattrapageSchedule); // Just to confirm it's working
      }
    );
  }

  getSeanceTypeStyle(type: string): string {
    switch (type) {
      case 'COURS': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'TD': return 'bg-green-100 border-green-300 text-green-800';
      case 'TP': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  }
   getConflictSeverityStyle(conflict: SeanceConflict): string {
    if (conflict.conflictTypes.includes('ROOM')) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (conflict.conflictTypes.includes('PROFESSOR')) {
      return 'bg-amber-50 border-amber-200 text-amber-700';
    }
    return 'bg-gray-50 border-gray-200 text-gray-700';
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
// Carousel properties
  currentSlide = 0;
  slides = [
    { name: 'Actualités', icon: 'bell', color: 'purple' },
    { name: 'Conflicts', icon: 'alert-triangle', color: 'red' },
    { name: 'Salles', icon: 'home', color: 'blue' },
    { name: 'Professeurs', icon: 'users', color: 'green' },
    { name: 'Rattrapages', icon: 'calendar', color: 'orange' }
  ];

  // Stats for slides
  actualitesCount = 0;
  availableRooms = 0;
  activeProfs = 0;
  upcomingRattrapages = 0;
  private destroy$ = new Subject<void>();
  private autoSlideInterval$ = interval(5000);





  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Carousel methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  private startAutoSlide(): void {
    this.autoSlideInterval$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }

  private loadStats(): void {
    // Example stats loading - replace with your actual data loading
    this.actualitesCount = 5; // Replace with actual count
    this.availableRooms = 10; // Replace with actual count
    this.activeProfs = 15; // Replace with actual count
    this.upcomingRattrapages = 3; // Replace with actual count
  }
  protected readonly Object = Object;
  currentUser='Douaa';
  currentDateTime: string='';
}
