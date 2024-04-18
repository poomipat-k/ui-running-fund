import { Component, Input } from '@angular/core';

import { range } from 'lodash-es';

@Component({
  selector: 'app-com-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() count = 0;
  @Input() pageSize = 5;

  get pageCount(): number {
    if (this.pageSize <= 0) {
      return 0;
    }
    return Math.ceil(this.count / this.pageSize);
  }

  get pageList(): number[] {
    return range(1, this.pageCount + 1);
  }
}
