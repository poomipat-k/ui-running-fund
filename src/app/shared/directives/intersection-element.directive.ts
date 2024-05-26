import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Observable, Subscription, debounceTime } from 'rxjs';

@Directive({
  selector: '[appIntersectionElement]',
  standalone: true,
})
export class IntersectionElementDirective implements OnInit, OnDestroy {
  @Input() root: HTMLElement | null = null;
  // 72px top margin is for web navbar
  @Input() rootMargin = '-72px 0px 0px 0px';
  @Input() threshold = 0;
  @Input() debounceTime = 0;
  @Input() isContinuous = true;

  @Output() isIntersecting = new EventEmitter<boolean>();

  _isIntersecting = false;
  subscription: Subscription;

  private readonly element: ElementRef = inject(ElementRef);

  ngOnInit() {
    this.subscription = this.createAndObserve();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createAndObserve() {
    const options: IntersectionObserverInit = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    return new Observable<boolean>((subscriber) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        subscriber.next(isIntersecting);

        isIntersecting &&
          !this.isContinuous &&
          intersectionObserver.disconnect();
      }, options);

      intersectionObserver.observe(this.element.nativeElement);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
        },
      };
    })
      .pipe(debounceTime(this.debounceTime))
      .subscribe((status) => {
        this.isIntersecting.emit(status);
        this._isIntersecting = status;
      });
  }

  constructor() {}
}
