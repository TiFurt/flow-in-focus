import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarLiftRoutingModule } from './car-lift-routing.module';
import { CarLiftComponent } from './car-lift.component';


@NgModule({
  declarations: [CarLiftComponent],
  imports: [CommonModule, CarLiftRoutingModule],
})
export class CarLiftModule {}
