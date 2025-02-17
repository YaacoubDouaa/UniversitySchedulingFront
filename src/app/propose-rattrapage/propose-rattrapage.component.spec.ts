import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeRattrapageComponent } from './propose-rattrapage.component';

describe('ProposeRattrapageComponent', () => {
  let component: ProposeRattrapageComponent;
  let fixture: ComponentFixture<ProposeRattrapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposeRattrapageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposeRattrapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
