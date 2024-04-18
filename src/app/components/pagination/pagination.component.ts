import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() currentPage = new EventEmitter<number>();

  protected activePage = 1;

  get pageCount(): number {
    if (this.pageSize <= 0) {
      return 0;
    }
    return Math.ceil(this.count / this.pageSize);
  }

  get pageList(): number[][] {
    if (this.pageCount === 0) {
      return [[]];
    }
    const finalList = [];
    const lower = this.activePage - 2;
    const upper = this.activePage + 2;
    if (lower <= 2) {
    }
    return [[]];
  }

  onActivePageChanged(page: number) {
    if (page === this.activePage) {
      return;
    }
    this.activePage = page;
    this.currentPage.emit(page);
  }
}
