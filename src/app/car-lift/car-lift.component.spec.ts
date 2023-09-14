import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLiftComponent } from './car-lift.component';

describe('CarLiftComponent', () => {
  let component: CarLiftComponent;
  let fixture: ComponentFixture<CarLiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarLiftComponent]
    });
    fixture = TestBed.createComponent(CarLiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
