import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { VIEW_MODE } from 'src/app/core/consts/view-mode-svg.const';
import { environment } from 'src/environments/environment';
import { Routes } from '../enums/routes.enum';
import { NavbarLink } from '../models/navbar-link.model';
import { FullScreenService } from 'src/app/shared/services/full-screen.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  private document = inject(DOCUMENT);
  private fullScreenService = inject(FullScreenService);

  env = environment;
  links: NavbarLink[] = [
    { label: 'Rampa', path: Routes.OiledRamp },
    { label: 'Carro', path: Routes.CarLift }
  ];
  color: ThemePalette = 'primary';
  isFullScreen = false;

  @ViewChild('viewMode', { read: ElementRef }) element: ElementRef;

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  onFullscreenChange(): void {
    this.isFullScreen = !!this.document.fullscreenElement;
    this.changeFullScreen(this.isFullScreen);
  }

  changeFullScreen(checked: boolean): void {
    if (checked) {
      this.openFullscreen();
      this.fullScreenService.fullscreen$.next(true);
    } else {
      this.closeFullscreen();
      this.fullScreenService.fullscreen$.next(false);
    }
  }

  openFullscreen(): void {
    const docElmWithBrowsersFullScreenFunctions = this.document
      .documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) {
      /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) {
      /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    const docWithBrowsersExitFunctions = this.document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };
    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) {
      /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) {
      /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
  }

  ngAfterViewInit(): void {
    this.setIcon();
  }

  setIcon(): void {
    if (this.element) {
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--on')
        .firstChild.setAttribute('d', VIEW_MODE.ON);
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--off')
        .firstChild.setAttribute('d', VIEW_MODE.OFF);
    }
  }
}
