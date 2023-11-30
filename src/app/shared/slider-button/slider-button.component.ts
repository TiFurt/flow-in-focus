import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Metric } from 'src/app/shared/slider-button/enums/metric.enum';
import { AbstractControl } from '@angular/forms';
import { FullScreenService } from 'src/app/shared/services/full-screen.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-slider-button',
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss']
})
export class SliderButtonComponent implements OnInit, OnDestroy {
  private fullScreenService = inject(FullScreenService);

  private _destroyed$ = new Subject<void>();

  fontScale = 1;

  @Input() max: number;
  @Input() min: number;
  @Input() step: number;
  @Input() label: string;
  @Input() hideSlider: boolean;
  @Input({ required: true }) metric: Metric;
  @Input({ required: true }) control: AbstractControl;

  ngOnInit(): void {
    this.fullScreenService.fullscreen$
      .pipe(takeUntil(this._destroyed$))
      .subscribe((isFullScreen: boolean) => {
        this.fontScale = isFullScreen ? 1.5 : 1;
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  formatLabel = (value: number): string => {
    return `${value}${this.metric}`;
  };
}
