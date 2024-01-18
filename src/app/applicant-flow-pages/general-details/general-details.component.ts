import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '../../components/input-text/input-text.component';

@Component({
  selector: 'app-applicant-general-details',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule],
  templateUrl: './general-details.component.html',
  styleUrl: './general-details.component.scss',
})
export class GeneralDetailsComponent {
  @Input() form: FormGroup;

  get generalFormGroup() {
    return this.form.get('general') as FormGroup;
  }

  public validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  private isFormValid(): boolean {
    return this.form.get('general')?.valid ?? false;
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('general');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }
  }
}
