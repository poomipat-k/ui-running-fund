import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-how-to-create',
  standalone: true,
  imports: [],
  templateUrl: './how-to-create.component.html',
  styleUrl: './how-to-create.component.scss',
})
export class HowToCreateComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  protected youtubeUrl = 'https://www.youtube.com/embed/lJIrF4YjHfQ';

  protected safeVideoUrl: SafeResourceUrl;
  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.safeVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.youtubeUrl
    );
  }
}
