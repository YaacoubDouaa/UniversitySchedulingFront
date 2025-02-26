import { Component } from '@angular/core';
import {map, Observable} from 'rxjs';
import {Salle, SalleList} from '../models/Salle';
import {RoomService} from '../rooms.service';

@Component({
  selector: 'app-technicien-dash-board',
  standalone: false,

  templateUrl: './technicien-dash-board.component.html',
  styleUrl: './technicien-dash-board.component.css'
})
export class TechnicienDashBoardComponent {
  rooms$: Observable<SalleList>;
  sallesList: Salle[] = [];
  currentSlide = 0;
  currentDateTime = '2025-02-26 20:31:02';
  currentUser = 'YaacoubDouaa';
  isAnimating = false;
  touchStartX = 0;
  touchEndX = 0;

  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  roomStats = {
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0
  };

  constructor(private roomService: RoomService) {
    this.rooms$ = this.roomService.getSalles().pipe(
      map(rooms => {
        if (rooms) {
          this.sallesList = Object.values(rooms);
          return rooms;
        }
        return {};
      })
    );
  }

  ngOnInit() {
    this.rooms$.subscribe(rooms => {
      if (rooms) {
        this.calculateRoomStats(rooms);
      }
    });

    this.startTimeUpdate();
  }



  private formatDateTime(date: Date): string {
    return date.toISOString()
      .replace('T', ' ')
      .split('.')[0];
  }
  calculateRoomStats(rooms: SalleList) {
    this.roomStats.total = Object.keys(rooms).length;

    // Calculate current occupancy
    const currentTime = this.getCurrentTimeSlot();
    const currentDay = this.getCurrentDay();

    Object.values(rooms).forEach(room => {
      if (this.isRoomOccupied(room, currentDay, currentTime)) {
        this.roomStats.occupied++;
      } else {
        this.roomStats.available++;
      }
    });
  }

  getCurrentTimeSlot(): string {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();

    // Map current time to available time slots
    if (hour >= 8 && (hour < 10 || (hour === 10 && minutes <= 0))) return '8:30-10:00';
    if (hour >= 10 && (hour < 11 || (hour === 11 && minutes <= 45))) return '10:15-11:45';
    if (hour >= 13 && (hour < 14 || (hour === 14 && minutes <= 30))) return '13:00-14:30';
    if (hour >= 14 && (hour < 16 || (hour === 16 && minutes <= 15))) return '14:45-16:15';
    if (hour >= 16 && hour < 18) return '16:30-18:00';
    return '';
  }

  getCurrentDay(): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return days[new Date().getDay()];
  }

  isRoomOccupied(room: Salle, day: string, timeSlot: string): boolean {
    return !!room.schedule[day]?.[timeSlot];
  }


  getOccupancyColor(room: Salle, day: string, timeSlot: string): string {
    return this.isRoomOccupied(room, day, timeSlot)
      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
  }
  private startTimeUpdate() {
    setInterval(() => {
      const now = new Date();
      this.currentDateTime = now.toISOString()
        .replace('T', ' ')
        .split('.')[0];
    }, 1000);
  }

  nextSlide(): void {
    if (this.isAnimating || !this.sallesList.length) return;
    this.isAnimating = true;
    this.currentSlide = (this.currentSlide + 1) % this.sallesList.length;
    this.resetAnimation();
  }

  previousSlide(): void {
    if (this.isAnimating || !this.sallesList.length) return;
    this.isAnimating = true;
    this.currentSlide = (this.currentSlide - 1 + this.sallesList.length) % this.sallesList.length;
    this.resetAnimation();
  }

  private resetAnimation(): void {
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchEnd(): void {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.previousSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  getSlideTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  getIndicators(): number[] {
    return Array.from({ length: this.sallesList.length }, (_, i) => i);
  }

  getRoomScheduleStatus(room: Salle, day: string, timeSlot: string): string {
    if (!room?.schedule?.[day]?.[timeSlot]) return 'Available';
    return Object.keys(room.schedule[day][timeSlot]).length > 0 ? 'Occupied' : 'Available';
  }


  protected readonly Object = Object;
}
