import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { OiledRampRoutingModule } from './oiled-ramp-routing.module';
import { OiledRampComponent } from './oiled-ramp.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [OiledRampComponent],
  imports: [CommonModule, OiledRampRoutingModule, MatCardModule, SharedModule]
})
export class OiledRampModule {}
