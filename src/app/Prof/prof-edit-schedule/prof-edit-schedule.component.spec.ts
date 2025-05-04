import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfEditScheduleComponent } from './prof-edit-schedule.component';

describe('ProfEditScheduleComponent', () => {
  let component: ProfEditScheduleComponent;
  let fixture: ComponentFixture<ProfEditScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfEditScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfEditScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
