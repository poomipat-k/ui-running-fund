import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnTypeEnum } from '../../shared/enums/column-type';
import { RadioOption } from '../../shared/models/radio-option';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';

@Component({
  selector: 'app-com-select-dropdown-template',
  standalone: true,
  imports: [TableCellTemplateComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './select-dropdown-template.component.html',
  styleUrl: './select-dropdown-template.component.scss',
})
export class SelectDropdownTemplateComponent {
  @Input() items: RadioOption[] = [];
  @Input() form: FormGroup;
  @Input() controlName = '';
  @Input() defaultValue: string;

  @Input() width = '100%';
  @Input() dropdownWidth = '100%';
  @Input() dropdownFontSize = '16px';
  @Input() disabled = false;
  @Input() onChange: () => void;

  @ViewChild('selectDropdownButton') selectDropdownButton: ElementRef;
  protected cellType = ColumnTypeEnum.Badge;

  protected showDropdown = false;

  get selectedValue() {
    return this.form.get(this.controlName)?.value || this.defaultValue;
  }

  onButtonClicked() {
    if (this.disabled) {
      return;
    }
    if (this.showDropdown) {
      this.hideDropdown();
    } else {
      this.showDropdown = true;
    }
  }

  onRadioValueChange() {
    // onChange from @Input()
    if (this.onChange) {
      this.onChange();
    }
  }

  onDropdownClicked() {
    this.hideDropdown();
  }

  private hideDropdown() {
    this.showDropdown = false;
  }
}
