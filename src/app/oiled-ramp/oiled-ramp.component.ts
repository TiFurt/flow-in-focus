import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { Metric } from '../shared/slider-button/enums/metric.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import p5 from 'p5';

@Component({
  templateUrl: './oiled-ramp.component.html',
  styleUrls: ['./oiled-ramp.component.scss']
})
export class OiledRampComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);

  private _destroyed$ = new Subject<void>();
  private lastAngle = 0;
  private lastWeight = 0;
  private lastViscosity = 0;
  private lastOilSize = 0;
  private lastSpeed = 0;
  private lastArea = 0;
  private readonly gravity = 9.80665;

  metric = Metric;
  formGroup: FormGroup;
  canvas: p5;
  canvasWidth: number;
  canvasHeight: number;
  cubeSize = 60;
  isPlaying = false;
  stepSize = 2;
  distanceIncreaseStep = 0;
  animationStart: Date;
  initialCubePosition: {
    x: number;
    y: number;
  };
  cubePosition: {
    x: number;
    y: number;
  };

  ngOnInit(): void {
    this.createFormGroup();
    this.listenToFormChanges();
    this.createCanvas();

    this.initialCubePosition = {
      x: this.canvasHeight / 2,
      y: -this.cubeSize
    };

    this.cubePosition = {
      x: this.canvasHeight / 2,
      y: -this.cubeSize
    };
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvasWidth = event.target.innerWidth - 100;
    this.canvasHeight = event.target.innerWidth / 2;
    this.canvas.resizeCanvas(this.canvasWidth, this.canvasHeight);
  }

  play(): void {
    this.cubePosition.x = this.canvasHeight - this.cubeSize;
    this.distanceIncreaseStep = this.stepSize;
    this.isPlaying = true;
    this.animationStart = new Date();
  }

  pause(): void {
    this.distanceIncreaseStep = 0;
    this.cubePosition = {
      x: this.initialCubePosition.x,
      y: this.initialCubePosition.y
    };
    this.isPlaying = false;
    this.animationStart = undefined;
  }

  private createFormGroup(): void {
    this.formGroup = this.fb.group({
      weight: [10],
      angle: [45],
      viscosity: [0],
      oilSize: [0],
      speed: [10],
      area: [10],
      acceleration: [{ value: 0, disabled: true }],
      tangencialForce: [{ value: 0, disabled: true }],
      frictionForce: [{ value: 0, disabled: true }]
    });

    this.calculateForce();
  }

  private listenToFormChanges(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => this.calculateForce());
  }

  private calculateForce(): void {
    const { area, angle, viscosity, oilSize, speed, weight } =
      this.formGroup.value;

    if (
      this.lastAngle === angle &&
      this.lastWeight === weight &&
      this.lastViscosity === viscosity &&
      this.lastOilSize === oilSize &&
      this.lastSpeed === speed &&
      this.lastArea === area
    ) {
      return;
    }

    this.lastAngle = angle;
    this.lastWeight = weight;
    this.lastViscosity = viscosity;
    this.lastOilSize = oilSize;
    this.lastSpeed = speed;
    this.lastArea = area;

    let tangencialForce: number;
    let frictionForce: number;
    let acceleration: number;
    if (oilSize > 0 || viscosity > 0) {
      const meterOilSize = oilSize / 1000;
      frictionForce = weight * this.gravity * Math.sin(angle);
      tangencialForce = viscosity * area * (speed / meterOilSize);
      acceleration = (frictionForce - tangencialForce) / weight;

      if (frictionForce < 0) {
        frictionForce = frictionForce * -1;
      }

      if (acceleration < 0) {
        acceleration = acceleration * -1;
      }
    } else {
      tangencialForce =
        weight * this.gravity * Math.sin((angle * Math.PI) / 180);
      acceleration = tangencialForce / weight;
      frictionForce = 0;
    }

    this.formGroup.get('tangencialForce').setValue(tangencialForce.toFixed(2));
    this.formGroup.get('frictionForce').setValue(frictionForce.toFixed(2));
    this.formGroup.get('acceleration').setValue(acceleration.toFixed(2));
  }

  private createCanvas(): void {
    const sketch = s => {
      this.canvasWidth = s.windowWidth - 100;
      this.canvasHeight = this.canvasWidth / 2;

      s.setup = () => {
        const canvas2 = s.createCanvas(this.canvasWidth, this.canvasHeight);
        canvas2.parent('graphic-oil');

        s.angleMode(s.DEGREES);
        s.background(255);
      };

      s.draw = () => {
        this.setUpGlobalLocations(s);

        s.background(255);

        this.drawGround(s);
        this.drawRamp(s);
        this.drawOilLayer(s);
        this.drawAngle(s);
        this.drawCube(s);
        this.drawForceVector(s);
        this.drawNormalVector(s);
        this.drawWeightVector(s);
      };
    };

    this.canvas = new p5(sketch);
  }

  private setUpGlobalLocations(sketch: any): void {
    if (!this.isPlaying) {
      sketch.frameRate(60);
      return;
    }

    const { acceleration } = this.formGroup.getRawValue();

    const timeDiff =
      (new Date().getTime() - this.animationStart.getTime()) / 1000;

    this.cubePosition.x -=
      this.distanceIncreaseStep * (acceleration * timeDiff);

    sketch.frameRate(200);
    if (this.cubePosition.x < -100 - this.cubeSize) {
      this.pause();
    }
    return;
  }

  private drawGround(sketch: any): void {
    sketch.translate(this.cubeSize + 10, this.canvasHeight - 40);
    sketch.noStroke();
    sketch.fill(129);
    sketch.rect(0, 0, this.canvasWidth, 40);
  }

  private drawRamp(sketch: any): void {
    const { angle } = this.formGroup.value;

    sketch.noStroke();
    sketch.rotate(-angle);
    sketch.fill(217);
    sketch.rect(0, 0, this.canvasWidth, 15);
  }

  private drawOilLayer(sketch: any): void {
    let { oilSize } = this.formGroup.value;

    sketch.noStroke();

    if (oilSize < Number.MIN_VALUE) {
      return;
    }

    if (oilSize > 1) {
      oilSize = 1;
    }

    const oilHeight = sketch.map(oilSize, 0, 1, 0, 8);
    sketch.fill(227, 175, 32, oilSize * 255);
    sketch.rect(0, 0, this.canvasWidth, oilHeight);
  }

  private drawAngle(sketch: any): void {
    const { angle } = this.formGroup.value;

    sketch.stroke(130, 95, 201);
    sketch.strokeWeight(2);
    sketch.noFill();
    sketch.arc(0, 0, 150, 150, 0, angle, sketch.OPEN);
  }

  private drawCube(sketch: any): void {
    sketch.stroke(67);
    sketch.strokeWeight(2);
    sketch.fill(234);
    sketch.rect(
      this.cubePosition.x,
      this.cubePosition.y,
      this.cubeSize,
      this.cubeSize
    );
  }

  private drawForceVector(sketch: any): void {
    let { tangencialForce } = this.formGroup.getRawValue();
    sketch.translate(0, -this.cubeSize / 2);

    if (tangencialForce < 0.1) {
      return;
    }

    if (tangencialForce > 20) {
      tangencialForce = 20;
    }

    sketch.stroke(146, 213, 136);
    sketch.strokeWeight(2);
    sketch.fill(146, 213, 136);
    sketch.line(
      this.cubePosition.x,
      0,
      this.cubePosition.x - tangencialForce * 10,
      0
    );
    sketch.triangle(
      this.cubePosition.x - tangencialForce * 10,
      0,
      this.cubePosition.x - tangencialForce * 10 + 5,
      -5,
      this.cubePosition.x - tangencialForce * 10 + 5,
      5
    );
  }

  private drawNormalVector(sketch: any): void {
    let { weight } = this.formGroup.getRawValue();
    const { angle } = this.formGroup.getRawValue();
    sketch.translate(0, -this.cubeSize / 2);

    if (angle >= 90) {
      return;
    }

    if (weight < 5) {
      weight = 5;
    }

    if (weight > 20) {
      weight = 20;
    }

    sketch.stroke(213, 136, 146);
    sketch.strokeWeight(2);
    sketch.fill(213, 136, 146);
    sketch.line(
      this.cubePosition.x + this.cubeSize / 2,
      0,
      this.cubePosition.x + this.cubeSize / 2,
      -(weight * 10 - 5)
    );
    sketch.triangle(
      this.cubePosition.x + this.cubeSize / 2,
      -(weight * 10 - 5),
      this.cubePosition.x + this.cubeSize / 2 - 5,
      -(weight * 10 - 5) + 5,
      this.cubePosition.x + this.cubeSize / 2 + 5,
      -(weight * 10 - 5) + 5
    );
  }

  private drawWeightVector(sketch: any): void {
    let { weight } = this.formGroup.getRawValue();
    const { angle } = this.formGroup.getRawValue();

    if (angle >= 90) {
      return;
    }

    if (weight < 5) {
      weight = 5;
    }

    if (weight > 20) {
      weight = 20;
    }

    sketch.stroke(136, 143, 213);
    sketch.strokeWeight(2);
    sketch.fill(136, 143, 213);
    sketch.translate(this.cubePosition.x + this.cubeSize / 2, this.cubeSize);
    sketch.rotate(angle);
    sketch.line(0, 0, 0, weight * 10);
    sketch.triangle(0, weight * 10, -5, weight * 10 - 5, 5, weight * 10 - 5);
  }
}
