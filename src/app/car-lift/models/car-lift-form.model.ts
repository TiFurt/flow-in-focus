import { FormControl, FormGroup } from '@angular/forms';

export interface CarLiftForm {
  strenght: FormGroup<StrenghtFormGroup>;
  car: FormGroup<CarFormGroup>;
}

export interface StrenghtFormGroup {
  radius: FormControl<number>;
  force: FormControl<number>;
  pressure: FormControl<number>;
  area: FormControl<number>;
}

export interface CarFormGroup {
  radius: FormControl<number>;
  weight: FormControl<number>;
  pressure: FormControl<number>;
  area: FormControl<number>;
}

export interface CarLift {
  strenght: Strenght;
  car: Car;
}

export interface Strenght {
  radius: number;
  force: number;
  pressure: number;
  area: number;
}

export interface Car {
  radius: number;
  weight: number;
  pressure: number;
  area: number;
}
