import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-com-upload-button',
  standalone: true,
  imports: [],
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss',
})
export class UploadButtonComponent implements OnInit {
  // Required to function
  @Input() filesSubject: BehaviorSubject<File[]>;

  @Input() text = 'เลือกไฟล์';
  @Input() disabled = false;
  @Input() accept = 'image/jpg, image/jpeg, image/png, .pdf, .doc, .docx ';

  files: File[] = [];

  ngOnInit(): void {
    if (this.filesSubject) {
      this.filesSubject.subscribe((filesTransmit) => {
        this.files = filesTransmit;
      });
    }
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element?.files;

    if (fileList && fileList?.length > 0) {
      const newFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file) {
          newFiles.push(file);
        }
      }
      this.files = newFiles;
      if (this.filesSubject) {
        this.filesSubject.next(newFiles);
      }
    }
  }

  removeFile(file: File) {
    if (this.filesSubject) {
      const newFiles = this.files.filter((f) => f.name !== file.name);
      this.filesSubject.next(newFiles);
    }
  }
}
