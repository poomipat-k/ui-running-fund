import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: string): unknown {
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }
}
