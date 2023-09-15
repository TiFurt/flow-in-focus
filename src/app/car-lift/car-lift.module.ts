import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarLiftRoutingModule } from './car-lift-routing.module';
import { CarLiftComponent } from './car-lift.component';
import { SliderButtonComponent } from 'src/app/shared/slider-button/slider-button.component';

@NgModule({
  declarations: [CarLiftComponent],
  imports: [CommonModule, CarLiftRoutingModule, SliderButtonComponent]
})
export class CarLiftModule {}
