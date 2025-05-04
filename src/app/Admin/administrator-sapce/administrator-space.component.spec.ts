import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorSpaceComponent } from './administrator-space.component';

describe('AdministratorSapceComponent', () => {
  let component: AdministratorSpaceComponent;
  let fixture: ComponentFixture<AdministratorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministratorSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
