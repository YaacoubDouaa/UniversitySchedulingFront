import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorViewScheduleComponent } from './professor-view-schedule.component';

describe('ProfessorViewScheduleComponent', () => {
  let component: ProfessorViewScheduleComponent;
  let fixture: ComponentFixture<ProfessorViewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessorViewScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorViewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
