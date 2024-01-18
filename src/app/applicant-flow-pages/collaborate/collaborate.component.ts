import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
export class CollaborateComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() selectedFilesCount = 0;
  @Input() uploadButtonTouched = false;
  @Input() fileNames: string[] = [];
  @Output() filesChanged = new EventEmitter<FileList>();

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

  get errorWrongFilesUpload(): boolean {
    return (
      this.form.get('collaborated')?.value === true &&
      this.selectedFilesCount === 0
    );
  }

  protected radioOptions: RadioOption[] = [
    { id: 1, value: false, display: 'ไม่มีการประสานงาน' },
    { id: 2, value: true, display: 'มีการประสานงานและมีหนังสือนำส่ง' },
  ];

  constructor() {
    this.onCollaborateChanged = this.onCollaborateChanged.bind(this);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('===[Collaborate] destroyed');
  }

  onCollaborateChanged() {
    console.log(
      '===[onCollaborateChanged]',
      this.form.get('collaborated')?.value
    );
    console.log('==this.form', this.form.get('collaborated'));
    if (this.form.get('collaborated')?.value === false) {
      console.log('==clear');
      this.clearSelectedFiles();
    }
  }

  public validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }

    if (this.errorWrongFilesUpload) {
      console.log('===Error file upload');
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

  onFilesChanged(files: FileList) {
    console.log('==[COLLAB] files', files);
    if (files) {
      this.filesChanged.emit(files);
      this.selectedFilesCount = files.length;
      console.log('==files len', files.length);
    }
  }

  clearSelectedFiles() {
    const newFl = new FileList();
    console.log('==newFL', newFl);
    this.filesChanged.emit(newFl);
  }
}
