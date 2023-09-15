import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { Metric } from 'src/app/shared/slider-button/enums/metric.enum';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-slider-button',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss']
})
export class SliderButtonComponent {
  @Input() max: number;
  @Input() min: number;
  @Input() step: number;
  @Input() label: string;
  @Input({ required: true }) metric: Metric;
  @Input({ required: true }) control: FormControl;

  formatLabel = (value: number): string => {
    return `${value}${this.metric}`;
  };
}
