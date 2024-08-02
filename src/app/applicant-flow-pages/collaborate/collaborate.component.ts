import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RadioComponent } from '../../components/radio/radio.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-collaborate',
  standalone: true,
  imports: [RadioComponent, UploadButtonComponent],
  templateUrl: './collaborate.component.html',
  styleUrl: './collaborate.component.scss',
})
export class CollaborateComponent {
  @Input() form: FormGroup;
  @Input() selectedFilesCount = 0;
  @Input() uploadButtonTouched = false;
  @Input() filesSubject: BehaviorSubject<File[]>;

  @Output() clearSelectedFiles = new EventEmitter();

  protected collaborationExampleUrl = environment.exampleFiles.collaboration;

  // Getters
  get uploadButtonDisabled(): boolean {
    if (this.form?.value?.collaborated) {
      return false;
    }
    return true;
  }

  get showCollaborationError(): boolean {
    const control = this.form.get('collaborated');
    return !control?.valid && (control?.touched ?? false);
  }

  protected radioOptions: RadioOption[] = [
    { id: 1, value: false, display: 'ไม่มีการประสานงาน' },
    { id: 2, value: true, display: 'มีการประสานงานและมีหนังสือนำส่ง' },
  ];

  constructor() {
    this.onCollaborateChanged = this.onCollaborateChanged.bind(this);
  }

  onCollaborateChanged() {
    if (this.form.get('collaborated')?.value === false) {
      this.clearSelectedFiles.emit();
    }
  }

  public validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }

    return true;
  }

  private isFormValid(): boolean {
    return this.form.get('collaborated')?.valid ?? false;
  }

  private markFieldsTouched() {
    const control = this.form.get('collaborated');
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  }
}
