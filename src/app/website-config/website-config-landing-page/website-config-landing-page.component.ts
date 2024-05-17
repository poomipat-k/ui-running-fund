import { NgOptimizedImage } from '@angular/common';
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
import {
  EditorComponent,
  EditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import {
  BehaviorSubject,
  Subscription,
  concatMap,
  lastValueFrom,
  map,
  of,
} from 'rxjs';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { S3Service } from '../../services/s3.service';
import { S3UploadResponse } from '../../shared/models/s3-upload-response';
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
    NgOptimizedImage,
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

  protected editorInit: EditorComponent['init'] = {};
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

    this.initRichTextEditor();
  }

  ngAfterViewInit(): void {
    this.watchFileChangesAndUploadFormData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initRichTextEditor() {
    this.editorInit = {
      base_url: '/tinymce',
      suffix: '.min',
      font_size_formats:
        '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt',
      images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg',
      images_reuse_filename: true,
      block_unsupported_drop: true,
      images_upload_handler: (blobInfo) => {
        const objectKey = `cms/landing/${Date.now()}-${blobInfo.filename()}`;
        const file = new File([blobInfo.blob()], objectKey);
        const promise = lastValueFrom(
          this.s3Service.getPutPresigned(objectKey).pipe(
            concatMap((putPresignedObject) => {
              return this.s3Service
                .putPresigned(putPresignedObject.presigned.URL, file)
                .pipe(
                  map(() => {
                    return putPresignedObject.fullPath;
                  })
                );
            })
          )
        );
        return promise;
      },
    };
  }

  private watchFileChangesAndUploadFormData() {
    this.subs.push(
      this.bannerFilesSubject
        .pipe(
          concatMap((files) => {
            if (files.length > 0) {
              const formData = new FormData();
              formData.append('banner', files[0]);
              return this.s3Service.uploadFileToStaticBucket(formData);
            }
            return of(new S3UploadResponse());
          })
        )
        .subscribe((response: S3UploadResponse) => {
          if (response.fullPath && response.objectKey) {
            this.bannerFormArray.push(
              new FormGroup({
                id: new FormControl(null),
                objectKey: new FormControl(response.objectKey),
                linkTo: new FormControl(null),
                fullPath: new FormControl(response.fullPath),
              })
            );
            console.log('===added to formArray', this.bannerFormArray.value);
            this.uploadButtonComponent.clearFiles();
            console.log('==cleared');
          }
        })
    );
  }

  protected getImageFileName(objectKey: string): string {
    return objectKey.split('/')?.[1];
  }

  onDeleteBanner(index: number) {
    this.bannerFormArray.removeAt(index);
  }

  modelChangeFn(e: any) {
    this.form.patchValue({ content: e });
    console.log(this.contentControl.value);
  }
}
