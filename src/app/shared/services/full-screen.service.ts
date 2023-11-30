import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullScreenService {
  fullscreen$ = new BehaviorSubject<boolean>(false);

  readonly fullscreenScale = 1.5;
  readonly normalScale = 1;
  readonly fullscreenFontSize = 32;
  readonly normalFontSize = 16;
}
