import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-com-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: string[] = [];
  @Input() intervalMs = 3000;

  protected blurList: boolean[] = [];
  protected isSafari = false;

  protected intervalId: any;
  protected scrollingTimerId: any;
  protected scrolling = false;

  @ViewChild('container') viewContainer: ElementRef;

  protected activeIndex = 0;

  ngOnInit(): void {
    this.blurList = this.slides.map((_) => true);
    if ((window as any)?.safari) {
      this.isSafari = true;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.scrollingTimerId);
  }

  onNavItemClick(index: number) {
    if (index !== this.activeIndex) {
      this.scrollToIndex(index);
      this.resetTimer();
    }
  }

  onBackClick() {
    this.scrollToIndex(this.activeIndex - 1);
    this.resetTimer();
  }

  onNextClick() {
    this.scrollToIndex(this.activeIndex + 1);
    this.resetTimer();
  }

  imageLoad(index: number) {
    this.blurList[index] = false;
    if (index === 0) {
      // Todo: uncomment the line below
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
    let index = 0;
    const len = this.slides.length;
    if (_index < 0) {
      index = len - 1;
    } else if (_index >= len) {
      index = 0;
    } else {
      index = _index;
    }
    const diff = index - this.activeIndex;
    this.activeIndex = index;
    this.scroll(diff);
  }

  private scroll(diff: number) {
    const scrollValue = diff * window.innerWidth;
    this.viewContainer.nativeElement.scrollLeft += scrollValue;
  }

  onScroll() {
    if (!this.scrolling) {
      this.scrolling = true;
      this.scrollingTimerId = setTimeout(() => {
        this.scrolling = false;
      }, 750);
    }
  }
}
