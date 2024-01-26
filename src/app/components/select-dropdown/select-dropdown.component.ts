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

@Component({
  selector: 'app-com-select-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent implements OnInit, OnDestroy {
  @ViewChild('inputIcon') inputIcon: ElementRef;
  @ViewChild('selectDropdownButton') selectDropdownButton: ElementRef;

  @Input() items: any[] = [];
  @Input() form: FormGroup;
  @Input() controlName = '';
  @Input() placeholder = 'เลือกการค้นหา';
  @Input() dropdownFontSize = '16px';
  @Input() width = '28.6rem';
  @Input() emptyMessage = 'ไม่พบข้อมูล';
  @Input() disabled = false;
  @Input() onChange: () => void;

  private readonly subs: Subscription[] = [];

  private listenerFn = () => {};

  private renderer: Renderer2 = inject(Renderer2);

  protected showDropdown = false;
  protected searchText = '';
  protected selectedDisplay = '';

  get filteredOptions(): any[] {
    const options = this.items.filter((item) =>
      item.display.toString()?.includes(this.searchText)
    );

    return options;
  }

  get inputValue() {
    if (!this.showDropdown) {
      const display = this.items.find(
        (item) => item.value === this.form.get(this.controlName)?.value
      )?.display;
      return display || '';
    }
    return this.searchText;
  }

  ngOnInit(): void {
    /*
    renderer.listen returns () => void. 
    Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
    */
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.selectDropdownButton.nativeElement &&
        e.target !== this.inputIcon.nativeElement
      ) {
        this.hideDropdown();
      }
    });

    this.onValueChanges();
  }

  ngOnDestroy(): void {
    this.listenerFn();
    this.subs.forEach((s) => s.unsubscribe());
  }

  onSearchChanged(event: any) {
    this.searchText = event.target.value;
  }

  onInputClick(e: Event) {
    // Check if the event target is really input element not the input icon
    if (
      !this.showDropdown &&
      e.target === this.selectDropdownButton.nativeElement
    ) {
      this.showDropdown = true;
    }
  }

  onInputIconClick() {
    if (this.disabled) {
      return;
    }
    if (this.showDropdown) {
      this.hideDropdown();
    } else {
      this.showDropdown = true;
    }
  }

  onDropdownClicked() {
    this.hideDropdown();
  }

  // internal subscription to show latest selected display
  private onValueChanges(): void {
    const control = this.form.get(this.controlName);
    if (control) {
      this.subs.push(
        control.valueChanges.subscribe((value) => {
          if (value || value === 0) {
            this.selectedDisplay = this.items.find(
              (item) => item.value === value
            )?.display;
          } else {
            this.selectedDisplay = '';
          }
        })
      );
    }
  }

  onRadioValueChange() {
    // onChange from @Input()
    if (this.onChange) {
      this.onChange();
    }
  }

  private hideDropdown() {
    this.showDropdown = false;
    this.searchText = '';
  }
}
