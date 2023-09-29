import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import p5 from 'p5';
import { Subject, debounceTime, of, switchMap, takeUntil } from 'rxjs';
import { Metric } from 'src/app/shared/slider-button/enums/metric.enum';

@Component({
  templateUrl: './car-lift.component.html',
  styleUrls: ['./car-lift.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarLiftComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private changeDetector = inject(ChangeDetectorRef);

  private _destroyed$ = new Subject<void>();

  metric = Metric;
  totalWidthStraightRects = 200;
  bottomRectHeight = 50;
  triangleHeight = 10;
  totalMeterLineItens = 9;
  strenghtHeightDicrease = 0;
  strenghtHeightDicreaseStep = 0;
  carHeightIncrease = 0;
  carHeightIncreaseStep = 0;
  stepSize = 3;
  IsPlaying: boolean;
  carImage: any;
  formGroup: FormGroup;
  initialFormGroupValue: any;
  canvas: p5;
  canvasWidth: number;
  canvasHeight: number;
  scaleSize: number;
  availableHeight: number;
  strengthTopPosition: number;
  carTopPosition: number;
  strengthTubeHeight: number;
  carTubeHeight: number;

  ngOnInit(): void {
    this.createFormGroup();

    this.createCanvas();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  play(): void {
    const { strength, car } = this.formGroup.getRawValue();

    this.strenghtHeightDicreaseStep = this.scaleSize * 0.015;

    this.carHeightIncreaseStep =
      (strength.area * this.strenghtHeightDicreaseStep) / car.area;

    this.IsPlaying = true;
  }

  pause(): void {
    this.strenghtHeightDicreaseStep = 0;
    this.carHeightIncreaseStep = 0;
    this.IsPlaying = false;
  }

  reset(): void {
    this.strenghtHeightDicrease = 0;
    this.carHeightIncrease = 0;
    this.formGroup.reset(this.initialFormGroupValue);
    this.pause();
  }

  nextStep(): void {
    this.strenghtHeightDicrease += this.stepSize;
    this.carHeightIncrease += this.stepSize;
  }

  previousStep(): void {
    this.strenghtHeightDicrease -= this.stepSize;
    this.carHeightIncrease -= this.stepSize;
  }

  private createFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      strength: this.formBuilder.group({
        radius: [1],
        force: [{ value: 50, disabled: true }],
        pressure: [{ value: 0, disabled: true }],
        area: [{ value: 3.14, disabled: true }]
      }),
      car: this.formBuilder.group({
        radius: [10],
        weight: [5000],
        pressure: [{ value: 0, disabled: true }],
        area: [{ value: 314.16, disabled: true }]
      })
    });
    this.initialFormGroupValue = this.formGroup.value;

    this.setListeners();
  }

  private setListeners(): void {
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        debounceTime(50),
        switchMap(() => {
          this.calculateArea();
          this.calculateForce();
          this.calculatePressure();
          this.changeDetector.detectChanges();
          return of();
        })
      )
      .subscribe();
  }

  private calculateArea(): void {
    const { strength, car } = this.formGroup.getRawValue();

    const strengthArea = Math.PI * Math.pow(strength.radius, 2);
    const carArea = Math.PI * Math.pow(car.radius, 2);

    this.formGroup.get('strength.area').setValue(strengthArea.toFixed(2));
    this.formGroup.get('car.area').setValue(carArea.toFixed(2));
  }

  private calculateForce(): void {
    const { strength, car } = this.formGroup.getRawValue();

    const force = (car.weight * strength.area) / car.area;
    this.formGroup.get('strength.force').setValue(Math.round(force));
  }

  private calculatePressure(): void {
    const { strength, car } = this.formGroup.getRawValue();

    const strengthArea = strength.area;
    const carArea = car.area;

    const strengthPressure = strength.force / strengthArea;
    const carPressure = car.weight / carArea;

    this.formGroup
      .get('strength.pressure')
      .setValue(strengthPressure.toFixed(2));
    this.formGroup.get('car.pressure').setValue(carPressure.toFixed(2));
  }

  private createCanvas(): void {
    const sketch = s => {
      this.canvasWidth = s.windowWidth - 100;
      this.canvasHeight = s.windowHeight * 0.6;

      s.setup = () => {
        this.carImage = s.loadImage('assets/images/car.png');
        console.log(s.getTargetFrameRate());

        const canvas2 = s.createCanvas(this.canvasWidth, this.canvasHeight);
        canvas2.parent('graphic-view');

        s.background(255);
      };

      s.draw = () => {
        this.setUpGlobalLocations(s);

        s.background(255);
        s.translate(this.getHalfCanvasWidth(), this.getHalfCanvasHeight());

        this.drawBottomRect(s);
        this.drawStrenghtRect(s);
        this.drawCarRect(s);
        this.drawForceVector(s);
        this.drawCarImage(s);
        this.drawMeterVector(s);
      };
    };

    this.canvas = new p5(sketch);
  }

  private setUpGlobalLocations(sketch: any): void {
    this.availableHeight =
      this.canvasHeight - this.bottomRectHeight - this.triangleHeight;

    this.strenghtHeightDicrease += this.strenghtHeightDicreaseStep;
    this.carHeightIncrease += this.carHeightIncreaseStep;

    this.scaleSize = this.availableHeight / this.totalMeterLineItens;
    this.strengthTopPosition =
      -this.getHalfCanvasHeight() +
      this.scaleSize +
      this.triangleHeight +
      this.strenghtHeightDicrease;

    this.carTopPosition =
      -this.getHalfCanvasHeight() +
      this.scaleSize * 8 +
      this.triangleHeight -
      this.carHeightIncrease;

    this.strengthTubeHeight =
      this.getHalfCanvasHeight() -
      this.strengthTopPosition -
      this.bottomRectHeight;

    this.carTubeHeight =
      this.getHalfCanvasHeight() - this.carTopPosition - this.bottomRectHeight;

    if (this.IsPlaying) {
      sketch.frameRate(120);
      if (this.strengthTubeHeight <= this.scaleSize) {
        this.pause();
      }
    } else {
      sketch.frameRate(60);
    }
  }

  private drawBottomRect(sketch: any): void {
    sketch.noStroke();
    sketch.fill('#012632');
    const bottomRectWidth =
      this.canvasWidth - this.totalWidthStraightRects - 100;
    sketch.rect(
      -bottomRectWidth / 2,
      this.getHalfCanvasHeight() - this.bottomRectHeight,
      bottomRectWidth,
      this.bottomRectHeight
    );
  }

  private drawStrenghtRect(sketch: any): void {
    const { strength } = this.formGroup.getRawValue();

    sketch.noStroke();
    sketch.fill('#012632');

    const strenghtRadius = this.convertRadiusToWidth(strength.radius);
    const strenghtRectPositionWidth =
      -this.getHalfCanvasWidth() -
      strenghtRadius +
      this.totalWidthStraightRects / 2;

    sketch.rect(
      strenghtRectPositionWidth,
      this.strengthTopPosition,
      strenghtRadius,
      -this.strengthTopPosition + this.getHalfCanvasHeight(),
      0,
      0,
      0,
      20
    );
    this.drawDashedLine(
      sketch,
      strenghtRectPositionWidth,
      this.strengthTopPosition,
      0
    );
  }

  private drawCarRect(sketch: any): void {
    const { car } = this.formGroup.getRawValue();

    sketch.noStroke();
    sketch.fill('#012632');

    const carRadius = this.convertRadiusToWidth(car.radius);
    const carRectPositionWidth =
      this.getHalfCanvasWidth() - this.totalWidthStraightRects / 2;

    sketch.rect(
      carRectPositionWidth,
      this.carTopPosition,
      carRadius,
      -this.carTopPosition + this.getHalfCanvasHeight(),
      0,
      0,
      20,
      0
    );
    this.drawDashedLine(
      sketch,
      0,
      this.carTopPosition,
      carRectPositionWidth + carRadius
    );
  }

  private drawForceVector(sketch: any): void {
    const { strength } = this.formGroup.getRawValue();

    const strenghtRadius = this.convertRadiusToWidth(strength.radius);
    const strenghtRectPositionWidth =
      -this.getHalfCanvasWidth() -
      strenghtRadius / 2 +
      this.totalWidthStraightRects / 2;

    sketch.stroke('#000');
    sketch.strokeWeight(2);
    sketch.fill('#000');

    const triangleHeight = strength.force / 4;
    const triangleWidth = triangleHeight / 2;

    const heightPosition = this.strengthTopPosition - triangleHeight;

    sketch.line(
      strenghtRectPositionWidth,
      heightPosition,
      strenghtRectPositionWidth,
      this.strengthTopPosition - triangleHeight * 2
    );
    sketch.triangle(
      strenghtRectPositionWidth,
      this.strengthTopPosition,
      strenghtRectPositionWidth - triangleWidth,
      heightPosition,
      strenghtRectPositionWidth + triangleWidth,
      heightPosition
    );

    this.drawForceValue(
      sketch,
      `${strength.force} ${this.metric.neuton}`,
      sketch.LEFT,
      strenghtRectPositionWidth + 15,
      this.strengthTopPosition - 20
    );
  }

  private drawCarImage(sketch: any): void {
    const { car } = this.formGroup.getRawValue();

    const carRadius = this.convertRadiusToWidth(car.radius);
    const carWidth = car.weight * 0.01 * 2;
    const carHeight = car.weight * 0.01;

    const carRectPositionWidth =
      this.getHalfCanvasWidth() -
      this.totalWidthStraightRects / 2 +
      carRadius / 2 -
      carWidth / 2;

    const carRectPositionHeight = this.carTopPosition - carHeight;

    sketch.fill('#000');

    sketch.image(
      this.carImage,
      carRectPositionWidth,
      carRectPositionHeight,
      carWidth,
      carHeight
    );

    this.drawForceValue(
      sketch,
      `${car.weight} ${this.metric.neuton}`,
      sketch.RIGHT,
      carRectPositionWidth - 15,
      carRectPositionHeight + carHeight / 2
    );
  }

  drawForceValue(
    sketch: any,
    text: string,
    alight: string,
    xPosition: number,
    yPosition: number
  ): void {
    sketch.textSize(20);
    sketch.textAlign(alight);
    sketch.strokeWeight(1.5);
    sketch.text(text, xPosition, yPosition);
  }

  private drawMeterVector(sketch: any): void {
    sketch.stroke('#000');
    sketch.strokeWeight(2);
    sketch.fill('#000');

    const triangleWidth = 5;
    const topPosition = -this.getHalfCanvasHeight() + this.triangleHeight;
    const bottomPosition = this.getHalfCanvasHeight() - this.bottomRectHeight;

    sketch.line(0, bottomPosition, 0, topPosition);
    sketch.triangle(
      0,
      -this.getHalfCanvasHeight(),
      -triangleWidth,
      topPosition,
      triangleWidth,
      topPosition
    );

    for (let i = 1; i < this.totalMeterLineItens; i++) {
      const linePosition =
        this.getHalfCanvasHeight() - this.bottomRectHeight - this.scaleSize * i;

      sketch.strokeWeight(2);
      sketch.line(0, linePosition, 5, linePosition);

      sketch.textSize(10);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.strokeWeight(1);
      sketch.text(i, 20, linePosition);
    }
  }

  private drawDashedLine(
    sketch: any,
    initialXPosition: number,
    yPosition: number,
    endXPosition: number
  ): void {
    sketch.stroke('#000');
    sketch.strokeWeight(2);

    for (
      initialXPosition;
      initialXPosition <= endXPosition;
      initialXPosition += 10
    ) {
      sketch.line(initialXPosition, yPosition, initialXPosition + 5, yPosition);
    }
  }

  private getTotalRadius(): number {
    const { strength, car } = this.formGroup.getRawValue();
    return (
      this.convertRadiusToWidth(strength.radius) +
      this.convertRadiusToWidth(car.radius)
    );
  }

  private getHalfCanvasWidth(): number {
    return this.canvasWidth / 2 - 50;
  }

  private getHalfCanvasHeight(): number {
    return this.canvasHeight / 2;
  }

  private convertRadiusToWidth(radius: number): number {
    return radius * 10;
  }
}
