import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ScheduleService} from '../../Services/ScheduleService/schedule-service.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleResolver implements Resolve<any> {
  constructor(private scheduleService: ScheduleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // Load the schedule data before the route is activated
    return this.scheduleService.getSchedule();
  }
}
