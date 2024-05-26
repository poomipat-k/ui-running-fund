import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { WebsiteConfigService } from '../services/website-config.service';
import { ImageRef } from '../shared/models/banner';
import { Footer } from '../shared/models/footer';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  get email(): string {
    return this.footerData?.contact?.email || '';
  }

  get phoneNumber(): string {
    return this.footerData?.contact?.phoneNumber || '';
  }

  get operatingHour(): string {
    return this.footerData?.contact?.operatingHour || '';
  }

  get logos(): ImageRef[] {
    return this.footerData?.logo || [];
  }

  protected footerData: Footer;

  ngOnInit(): void {
    this.websiteConfigService.getFooter().subscribe((result) => {
      if (result) {
        this.footerData = result;
      }
    });
  }
}
