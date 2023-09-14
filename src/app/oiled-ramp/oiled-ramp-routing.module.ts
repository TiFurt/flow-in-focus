import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OiledRampComponent } from './oiled-ramp.component';

const routes: Routes = [
  { path: '', component: OiledRampComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OiledRampRoutingModule { }
