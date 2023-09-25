import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarLiftRoutingModule } from './car-lift-routing.module';
import { CarLiftComponent } from './car-lift.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [CarLiftComponent],
  imports: [CommonModule, CarLiftRoutingModule, MatCardModule, SharedModule]
})
export class CarLiftModule {}
