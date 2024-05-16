import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { BehaviorSubject, Subscription, concatMap, map, of } from 'rxjs';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { S3Service } from '../../services/s3.service';
import { Presigned } from '../../shared/models/presigned-url';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-website-config-landing-page',
  standalone: true,
  imports: [
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    SafeHtmlPipe,
    UploadButtonComponent,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  templateUrl: './website-config-landing-page.component.html',
  styleUrl: './website-config-landing-page.component.scss',
})
export class WebsiteConfigLandingPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('uploadButton') uploadButtonComponent: UploadButtonComponent;

  @Input() bannerFilesSubject: BehaviorSubject<File[]>;
  @Input() form: FormGroup;

  private readonly subs: Subscription[] = [];

  private readonly s3Service: S3Service = inject(S3Service);

  protected editorInit = {
    base_url: '/tinymce',
    suffix: '.min',
    font_size_formats:
      '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt',
    images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg',
  };
  protected editorPlugins =
    'preview autolink autosave save code visualblocks visualchars fullscreen image link media codesample table charmap nonbreaking anchor lists advlist wordcount help charmap quickbars emoticons';
  protected editorToolbar =
    'undo redo | blocks fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | anchor codesample';

  get dataGroup(): FormGroup {
    return this.form.get('data') as FormGroup;
  }

  get bannerFormArray(): FormArray {
    return this.form.get('banner') as FormArray;
  }

  get contentControl(): FormControl {
    return this.form.get('content') as FormControl;
  }

  get selectedFiles() {
    return this.uploadButtonComponent?.files || [];
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((values) => {
      console.log('==values:', values);
    });
  }

  ngAfterViewInit(): void {
    this.watchFileChangesAndUploadFormData();

    // this.watchFileChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private watchFileChangesAndUploadFormData() {
    // upload with form data
    this.subs.push(
      this.bannerFilesSubject
        .pipe(
          concatMap((files) => {
            if (files.length > 0) {
              const formData = new FormData();
              formData.append('banner', files[0]);
              return this.s3Service.uploadFileToStaticBucket(formData);
            }
            return of('');
          })
        )
        .subscribe((fileName) => {
          console.log('==fileName', fileName);
          if (fileName) {
            console.log('==uploaded!!');
            this.bannerFormArray.push(
              new FormGroup({
                id: new FormControl(null),
                fileName: new FormControl(this.getImageFileName(fileName)),
                linkTo: new FormControl(null),
                imageAddress: new FormControl(this.getImageAddress(fileName)),
              })
            );
            console.log('===added to formArray', this.bannerFormArray);
            this.uploadButtonComponent.clearFiles();
            console.log('==cleared');
          } else {
            console.log('=== no file name');
          }
        })
    );
  }

  private watchFileChanges() {
    this.subs.push(
      this.bannerFilesSubject
        .pipe(
          concatMap((files) => {
            if (files.length > 0) {
              return this.s3Service
                .getPutPresigned()
                .pipe(map((presigned) => ({ presigned, files })));
            }
            return of({
              presigned: new Presigned(),
              files,
            });
          }),
          concatMap((object) => {
            console.log('==object', object);
            if (object?.presigned?.URL && object.files?.length) {
              return this.s3Service.putPresigned(
                object.presigned.URL,
                object.files[0]
              );
            }
            return of(false);
          })
        )
        .subscribe((result) => {
          console.log('==result', result);
        })
    );
  }

  private getImageFileName(fileName: string): string {
    return fileName.split('/')?.[1];
  }

  private getImageAddress(fileName: string): string {
    return `https://running-fund-static-store.s3.ap-southeast-1.amazonaws.com/${fileName}`;
  }

  onClick() {
    console.log('==form', this.form);
  }

  modelChangeFn(e: any) {
    this.form.patchValue({ content: e });
    console.log(this.contentControl.value);
  }
}
