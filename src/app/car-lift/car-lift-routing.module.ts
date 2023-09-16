import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarLiftComponent } from './car-lift.component';

const routes: Routes = [{ path: '', component: CarLiftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarLiftRoutingModule {}
