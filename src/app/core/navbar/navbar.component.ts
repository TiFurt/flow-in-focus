import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavbarLink } from '../models/navbar-link.model';
import { Routes } from '../enums/routes.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  env = environment;
  links: NavbarLink[] = [
    { label: 'Rampa', path: Routes.OiledRamp },
    { label: 'Carro', path: Routes.Car },
  ];
}
