import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';
import { CarLiftRoutingModule } from './car-lift-routing.module';
import { CarLiftComponent } from './car-lift.component';

@NgModule({
  declarations: [CarLiftComponent],
  imports: [
    CommonModule,
    CarLiftRoutingModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class CarLiftModule {}
