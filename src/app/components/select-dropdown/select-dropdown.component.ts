import { Component, Input } from '@angular/core';
import { ArrowDropdownComponent } from '../svg/arrow-dropdown/arrow-dropdown.component';

@Component({
  selector: 'app-com-select-dropdown',
  standalone: true,
  imports: [ArrowDropdownComponent],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent {
  @Input() placeholder = 'เลือกการค้นหา';
  protected showDropdown = false;
}
