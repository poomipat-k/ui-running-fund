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

  private listenerFn = () => {};

  private renderer: Renderer2 = inject(Renderer2);

  protected showDropdown = false;
  protected searchText = '';
  protected selectedDisplay = '';

  get filteredOptions(): any[] {
    return this.items.filter((item) => item.display.includes(this.searchText));
  }

  get inputValue() {
    if (!this.showDropdown) {
      return this.selectedDisplay;
    }
    return this.searchText;
  }

  ngOnInit(): void {
    /*
    renderer.listen returns () => void. 
    Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
    */
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      console.log(e.target);
      if (
        e.target !== this.selectDropdownButton.nativeElement &&
        e.target !== this.inputIcon.nativeElement
      ) {
        // e.target !== this.inputIcon.nativeElement

        console.log('===Other');
        this.hideDropdown();
      } else if (e.target === this.inputIcon.nativeElement) {
        console.log('====Icon');
        if (this.showDropdown) {
          this.hideDropdown();
        } else {
          this.showDropdown = true;
        }
      } else {
        console.log('==Input');
      }
    });
  }

  ngOnDestroy(): void {
    this.listenerFn();
  }

  onSearchChanged(event: any) {
    this.searchText = event.target.value;
  }

  onInputClick() {
    if (!this.showDropdown) {
      this.showDropdown = true;
    }
  }

  // onInputIconClick() {
  //   console.log('==onInputIconClick');
  //   if (this.showDropdown) {
  //     this.hideDropdown();
  //   } else {
  //     this.showDropdown = true;
  //   }
  // }

  onDropdownClicked() {
    this.hideDropdown();
  }

  onRadioValueChange() {
    this.selectedDisplay = this.form.value[this.controlName];
    console.log('===DISPLAY:', this.selectedDisplay);
  }

  private hideDropdown() {
    this.showDropdown = false;
    this.searchText = '';
  }
}
