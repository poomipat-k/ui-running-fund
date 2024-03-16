import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-com-upload-button',
  standalone: true,
  imports: [],
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss',
})
export class UploadButtonComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileButton: ElementRef;
  // Required to function
  @Input() filesSubject: BehaviorSubject<File[]>;

  @Input() text = 'เลือกไฟล์';
  @Input() disabled = false;
  @Input() accept = 'image/jpg, image/jpeg, image/png, .pdf, .doc, .docx ';

  private readonly subs: Subscription[] = [];

  files: File[] = [];

  ngOnInit(): void {
    if (this.filesSubject) {
      this.subs.push(
        this.filesSubject.subscribe((filesTransmit) => {
          this.files = filesTransmit;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
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

      if (this.fileButton.nativeElement?.files) {
        const dt = new DataTransfer();
        const files = this.fileButton.nativeElement.files;

        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (file.name !== f.name) {
            dt.items.add(f);
          }
        }
        this.fileButton.nativeElement.files = dt.files;
      }
    }
  }
}
