import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Routes as ProjectRoutes } from './core/enums/routes.enum';

const routes: Routes = [
  {
    path: ProjectRoutes.OiledRamp,
    loadChildren: () =>
      import('./oiled-ramp/oiled-ramp.module').then((m) => m.OiledRampModule),
  },
  {
    path: ProjectRoutes.CarLift,
    loadChildren: () =>
      import('./car-lift/car-lift.module').then((m) => m.CarLiftModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
