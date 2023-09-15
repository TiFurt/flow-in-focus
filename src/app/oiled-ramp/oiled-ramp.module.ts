import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OiledRampRoutingModule } from './oiled-ramp-routing.module';
import { OiledRampComponent } from './oiled-ramp.component';

@NgModule({
  declarations: [OiledRampComponent],
  imports: [CommonModule, OiledRampRoutingModule]
})
export class OiledRampModule {}
