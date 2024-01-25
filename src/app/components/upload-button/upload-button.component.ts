import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-com-upload-button',
  standalone: true,
  imports: [],
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss',
})
export class UploadButtonComponent {
  @Input() text = 'เลือกไฟล์';
  @Input() disabled = false;
  @Input() accept = 'image/jpg, image/jpeg, image/png, .pdf, .doc, .docx ';

  @Output() filesChanged = new EventEmitter<File[]>();

  files: File[] = [];

  fileNames: string[] = [];

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element?.files;

    if (fileList && fileList?.length > 0) {
      const names: string[] = [];
      const newFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file) {
          newFiles.push(file);
          names.push(file.name);
        }
      }
      this.files = newFiles;
      this.filesChanged.emit(newFiles);
      this.fileNames = names;
    }
  }

  popFile() {
    console.log('===before', this.files);
    if (this.files.length > 0) {
      const file = this.files.pop();
      if (file) {
        this.fileNames = this.fileNames.filter((name) => name !== file.name);
      }
    }
    console.log('==after', this.files);
  }
}
