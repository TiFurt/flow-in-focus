import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiledRampComponent } from './oiled-ramp.component';

describe('OiledRampComponent', () => {
  let component: OiledRampComponent;
  let fixture: ComponentFixture<OiledRampComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OiledRampComponent]
    });
    fixture = TestBed.createComponent(OiledRampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
