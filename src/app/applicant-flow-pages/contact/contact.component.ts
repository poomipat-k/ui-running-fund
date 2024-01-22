import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';

@Component({
  selector: 'app-applicant-contact',
  standalone: true,
  imports: [InputTextComponent, CheckboxComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  protected formTouched = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  get projectHeadGroup(): FormGroup {
    return this.form.get('contact.projectHead') as FormGroup;
  }

  get projectManagerGroup(): FormGroup {
    return this.form.get('contact.projectManager') as FormGroup;
  }

  validToGoNext(): boolean {
    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  private isFormValid(): boolean {
    return this.form.get('contact')?.valid ?? false;
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('contact');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const fromGroup = this.form.get('contact') as FormGroup;
    const errorId = this.getFirstErrorIdWithPrefix(fromGroup, '');
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }
}
