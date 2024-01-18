import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
export class CollaborateComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() filesChanged = new EventEmitter<FileList>();

  protected selectedFilesCount = 0;

  get uploadButtonDisabled(): boolean {
    if (this.form?.value?.collaborated) {
      return false;
    }
    return true;
  }

  get collaboratedControl() {
    return this.form.get('collaborated');
  }

  get showCollaborationError(): boolean {
    const control = this.collaboratedControl;
    return !control?.valid && (control?.touched ?? false);
  }

  radioOptions: RadioOption[] = [
    { id: 1, value: false, display: 'ไม่มีการประสานงาน' },
    { id: 2, value: true, display: 'มีการประสานงานและมีหนังสือนำส่ง' },
  ];

  public validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    if (this.errorWrongFilesUpload()) {
      console.log('===Error file upload');
      return false;
    }
    return true;
  }

  private errorWrongFilesUpload(): boolean {
    return (
      this.collaboratedControl?.value === true && this.selectedFilesCount === 0
    );
  }

  private isFormValid(): boolean {
    return this.collaboratedControl?.valid ?? false;
  }

  private markFieldsTouched() {
    if (this.collaboratedControl) {
      this.collaboratedControl.markAsTouched({ onlySelf: true });
    }
  }

  onFilesChanged(files: FileList) {
    console.log('==collab files', files);
    if (files) {
      this.filesChanged.emit(files);
      this.selectedFilesCount = files.length;
      console.log('==files len', files.length);
    }
  }

  ngOnInit(): void {}
}
