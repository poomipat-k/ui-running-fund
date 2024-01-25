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
  @Input() accept = 'image/*, .pdf, .doc, .docx ';

  @Output() filesChanged = new EventEmitter<FileList>();

  fileNames: string[] = [];

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element.files;

    console.log('===button filelist', fileList);
    if (fileList && fileList?.length > 0) {
      this.filesChanged.emit(fileList);
    }
  }
}
