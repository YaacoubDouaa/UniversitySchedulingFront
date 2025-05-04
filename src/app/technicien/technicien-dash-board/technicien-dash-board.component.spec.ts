import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienDashBoardComponent } from './technicien-dash-board.component';

describe('TechnicienDashBoardComponent', () => {
  let component: TechnicienDashBoardComponent;
  let fixture: ComponentFixture<TechnicienDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicienDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
