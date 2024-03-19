import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
export class SelectDropdownTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('selectDropdownButton') selectDropdownButton: ElementRef;
  @ViewChild('inputIcon') inputIcon: ElementRef;

  @Input() items: RadioOption[] = [];
  @Input() form: FormGroup;
  @Input() controlName = '';
  @Input() defaultValue: string;

  @Input() width = '100%';
  @Input() dropdownWidth = '100%';
  @Input() dropdownFontSize = '16px';
  @Input() disabled = false;
  @Input() onChange: () => void;

  private listenerFn = () => {};
  private renderer: Renderer2 = inject(Renderer2);
  private readonly subs: Subscription[] = [];

  protected cellType = ColumnTypeEnum.Badge;

  protected showDropdown = false;

  get selectedValue() {
    return this.form.get(this.controlName)?.value || this.defaultValue;
  }

  ngOnInit(): void {
    /*
    renderer.listen returns () => void. 
    Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
    */
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      const clickedOutside = this.selectDropdownButton.nativeElement.contains(
        e.target
      );
      if (this.showDropdown && !clickedOutside) {
        this.hideDropdown();
      }
    });
  }

  ngOnDestroy(): void {
    this.listenerFn();
    this.subs.forEach((s) => s.unsubscribe());
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
