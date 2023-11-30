import { Component, OnInit, inject } from '@angular/core';
import { FullScreenService } from 'src/app/shared/services/full-screen.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private fullScreenService = inject(FullScreenService);

  fontSize = this.fullScreenService.normalFontSize;

  title = environment.appName;

  ngOnInit(): void {
    this.fullScreenService.fullscreen$.subscribe((isFullScreen: boolean) => {
      this.fontSize = isFullScreen
        ? this.fullScreenService.fullscreenFontSize
        : this.fullScreenService.normalFontSize;
    });
  }
}
