import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-com-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  @Input() slides: string[] = [
    'https://running-fund-static-store-prod.s3.ap-southeast-1.amazonaws.com/banner/test_1.jpeg',
    'https://running-fund-static-store-prod.s3.ap-southeast-1.amazonaws.com/banner/test_2.jpeg',
    'https://running-fund-static-store-prod.s3.ap-southeast-1.amazonaws.com/banner/test_3.jpeg',
    'https://running-fund-static-store-prod.s3.ap-southeast-1.amazonaws.com/banner/test_4.jpeg',
    'https://running-fund-static-store-prod.s3.ap-southeast-1.amazonaws.com/banner/test_5.jpeg',
  ];

  @ViewChild('container') viewContainer: ElementRef;

  protected activeIndex = 0;

  getSlideId(index: number) {
    return `slide__${index}`;
  }

  onNavItemClick(index: number) {
    if (index !== this.activeIndex) {
      const diff = index - this.activeIndex;
      this.activeIndex = index;
      this.scroll(diff);
    }
  }

  private scroll(diff: number) {
    const scrollValue = diff * window.innerWidth;
    this.viewContainer.nativeElement.scrollLeft += scrollValue;
  }
}
