import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-com-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() slides: string[] = [];
  @Input() intervalMs = 3000;

  protected intervalId: any;

  @ViewChild('container') viewContainer: ElementRef;

  protected activeIndex = 0;

  ngAfterViewInit(): void {
    this.resetTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  onNavItemClick(index: number) {
    if (index !== this.activeIndex) {
      this.scrollToIndex(index);
      this.resetTimer();
    }
  }

  private resetTimer() {
    if (!!this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.scrollToIndex(this.activeIndex + 1);
    }, this.intervalMs);
  }

  private scrollToIndex(_index: number) {
    const index = _index >= this.slides.length ? 0 : _index;
    const diff = index - this.activeIndex;
    this.activeIndex = index;
    this.scroll(diff);
  }

  private scroll(diff: number) {
    const scrollValue = diff * window.innerWidth;
    this.viewContainer.nativeElement.scrollLeft += scrollValue;
  }
}
