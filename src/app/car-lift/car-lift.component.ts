import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import p5 from 'p5';
import { Subject } from 'rxjs';
import { Metric } from 'src/app/shared/slider-button/enums/metric.enum';

@Component({
  templateUrl: './car-lift.component.html',
  styleUrls: ['./car-lift.component.scss']
})
export class CarLiftComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);

  private _destroyed$ = new Subject<void>();

  carImage: any;
  formGroup: FormGroup;
  metric = Metric;
  canvas: p5;
  canvasWidth: number;
  canvasHeight: number;
  totalWidthStraightRects = 200;

  ngOnInit(): void {
    this.createFormGroup();

    this.createCanvas();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private createFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      strength: this.formBuilder.group({
        radius: [1],
        force: [{ value: 1, disabled: true }]
      }),
      car: this.formBuilder.group({
        radius: [10],
        weight: [{ value: 5000, disabled: true }]
      })
    });
  }

  private createCanvas(): void {
    const sketch = s => {
      this.canvasWidth = s.windowWidth - 100;
      this.canvasHeight = s.windowHeight * 0.6;

      s.setup = () => {
        this.carImage = s.loadImage('assets/images/car.png');

        const canvas2 = s.createCanvas(this.canvasWidth, this.canvasHeight);
        canvas2.parent('graphic-view');

        s.background(255);
      };

      s.draw = () => {
        s.background(255);
        s.translate(this.getHalfCanvasWidth(), this.getHalfCanvasHeight());

        this.drawBottomRect(s);
        this.drawStrenghtRect(s);
        this.drawCarRect(s);
        this.drawForceVector(s);
        this.drawCarImage(s);
      };
    };

    this.canvas = new p5(sketch);
  }

  private drawBottomRect(sketch: any): void {
    sketch.noStroke();
    sketch.fill('#012632');
    const bottomRectHeight = 50;
    const bottomRectWidth =
      this.canvasWidth - this.totalWidthStraightRects - 100;
    sketch.rect(
      -bottomRectWidth / 2,
      this.getHalfCanvasHeight() - bottomRectHeight,
      bottomRectWidth,
      bottomRectHeight
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
      -this.getHalfCanvasHeight() + 100, // 100 = vector height
      strenghtRadius,
      this.canvasHeight - 100, // 100 = vector height
      0,
      0,
      0,
      20
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
      -this.getHalfCanvasHeight() + 100, // 100 = vector height
      carRadius,
      this.canvasHeight - 100, // 100 = vector height
      0,
      0,
      20,
      0
    );
  }

  private drawForceVector(sketch: any): void {
    const { strength } = this.formGroup.getRawValue();

    const strenghtRadius = this.convertRadiusToWidth(strength.radius);
    const strenghtRectPositionWidth =
      -this.getHalfCanvasWidth() -
      strenghtRadius / 2 +
      this.totalWidthStraightRects / 2;
    const strenghtRectPositionHeight = -this.getHalfCanvasHeight() + 100;

    sketch.stroke('#000');
    sketch.strokeWeight(2);
    sketch.fill('#000');

    const triangleHeight = strength.force * 10;
    const triangleWidth = triangleHeight / 2;

    const heightPosition = strenghtRectPositionHeight - triangleHeight;

    sketch.line(
      strenghtRectPositionWidth,
      heightPosition,
      strenghtRectPositionWidth,
      strenghtRectPositionHeight - triangleHeight * 2
    );
    sketch.triangle(
      strenghtRectPositionWidth,
      strenghtRectPositionHeight,
      strenghtRectPositionWidth - triangleWidth,
      heightPosition,
      strenghtRectPositionWidth + triangleWidth,
      heightPosition
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

    const carRectPositionHeight = -this.getHalfCanvasHeight() + 100 - carHeight;

    sketch.fill('#000');

    sketch.image(
      this.carImage,
      carRectPositionWidth,
      carRectPositionHeight,
      carWidth,
      carHeight
    );
  }

  private getTotalRadius(): number {
    const { strength, car } = this.formGroup.value;
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
