import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienGlobalScheduleComponent } from './technicien-global-schedule.component';

describe('TechnicienGlobalScheduleComponent', () => {
  let component: TechnicienGlobalScheduleComponent;
  let fixture: ComponentFixture<TechnicienGlobalScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicienGlobalScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienGlobalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
