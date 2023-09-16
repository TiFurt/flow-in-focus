import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarLiftRoutingModule } from './car-lift-routing.module';
import { CarLiftComponent } from './car-lift.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CarLiftComponent],
  imports: [CommonModule, CarLiftRoutingModule, SharedModule]
})
export class CarLiftModule {}
