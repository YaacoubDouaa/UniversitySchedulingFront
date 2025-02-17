import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorSpaceComponent } from './professor-space.component';

describe('ProfessorSpaceComponent', () => {
  let component: ProfessorSpaceComponent;
  let fixture: ComponentFixture<ProfessorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessorSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
