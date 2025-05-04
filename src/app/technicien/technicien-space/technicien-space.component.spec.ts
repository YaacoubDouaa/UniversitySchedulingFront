import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienSpaceComponent } from './technicien-space.component';

describe('TechnicienSpaceComponent', () => {
  let component: TechnicienSpaceComponent;
  let fixture: ComponentFixture<TechnicienSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicienSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
