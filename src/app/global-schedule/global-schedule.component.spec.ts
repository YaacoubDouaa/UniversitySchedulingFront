import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalScheduleComponent } from './global-schedule.component';

describe('GlobalScheduleComponent', () => {
  let component: GlobalScheduleComponent;
  let fixture: ComponentFixture<GlobalScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
