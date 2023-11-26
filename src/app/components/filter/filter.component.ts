import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterOption } from '../../shared/models/filter-option';

@Component({
  selector: 'app-com-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() filterOptions: FilterOption[] = [];
  @Output() selectedFilter = new EventEmitter<FilterOption>();

  protected currentOption: FilterOption;

  protected showOptions = false;
  filterText = 'จัดเรียงโดย';

  constructor() {}

  toggleFilter(): void {
    this.showOptions = !this.showOptions;
    return;
  }

  onSelectFilter(option: FilterOption) {
    if (option && option.id !== this.currentOption?.id) {
      this.currentOption = option;
      this.selectedFilter.emit(option);
      this.filterText = option.display;
    }
  }
}
