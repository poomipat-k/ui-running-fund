import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-select-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent {
  @Input() items: any[] = [];
  @Input() form: FormGroup;
  @Input() controlName = '';
  @Input() placeholder = 'เลือกการค้นหา';
  @Input() dropdownFontSize = '16px';
  @Input() width = '28.6rem';
  protected showDropdown = false;
  protected searchText = '';

  get filteredOptions(): any[] {
    return this.items.filter((item) => item.display.includes(this.searchText));
  }

  onSearchChanged(event: any) {
    console.log('===onSearchChanged event', event);
    this.searchText = event.target.value;
    console.log('===searchText', this.searchText);
  }

  onClick() {
    console.log('==onClick');
    if (!this.showDropdown) {
      this.showDropdown = true;
    }
  }
}
