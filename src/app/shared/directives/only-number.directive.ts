import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true,
})
export class OnlyNumberDirective {
  @Input() appInput: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value.replace(/[^0-9]*/g, '');
    input.value = originalValue;
  }
}
