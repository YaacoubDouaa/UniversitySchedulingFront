import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfScheduleComponent } from './prof-schedule.component';

describe('ProfScheduleComponent', () => {
  let component: ProfScheduleComponent;
  let fixture: ComponentFixture<ProfScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
