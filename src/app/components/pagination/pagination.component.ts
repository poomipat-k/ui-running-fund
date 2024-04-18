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
    const finalList: number[][] = [];
    const lower = this.activePage - 2;
    const upper = this.activePage + 2;
    let group = [];
    for (let i = lower; i <= upper; i++) {
      if (i >= 1 && i <= this.pageCount) {
        group.push(i);
      }
    }
    if (group[0] === 2) {
      group.unshift(1);
    }
    if (group[group.length - 1] === this.pageCount - 1) {
      group.push(this.pageCount);
    }
    // Order groups
    if (group[0] !== 1) {
      finalList.push([1]);
      // -3 to be interpreted as "..."
      finalList.push([-3]);
    }
    finalList.push(group);
    if (group[group.length - 1] !== this.pageCount) {
      // -3 to be interpreted as "..."
      finalList.push([-3]);
      finalList.push([this.pageCount]);
    }
    console.log('===finalList', finalList);
    return finalList;
  }

  onActivePageChanged(page: number) {
    if (page === this.activePage) {
      return;
    }
    this.activePage = page;
    this.currentPage.emit(page);
  }
}
