import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { concatMap, lastValueFrom, map } from 'rxjs';
import { S3Service } from '../../services/s3.service';

@Component({
  selector: 'app-com-custom-editor',
  standalone: true,
  imports: [EditorModule, ReactiveFormsModule],
  templateUrl: './custom-editor.component.html',
  styleUrl: './custom-editor.component.scss',
})
export class CustomEditorComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() imageUploadPrefix = 'cms/etc';

  private readonly s3Service: S3Service = inject(S3Service);

  protected editorInit: EditorComponent['init'] = {};
  protected editorPlugins =
    'preview autolink autosave save code visualblocks visualchars fullscreen image link media codesample table charmap nonbreaking anchor lists advlist wordcount help charmap quickbars emoticons';
  protected editorToolbar =
    'undo redo | blocks fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | anchor codesample';

  ngOnInit(): void {
    this.initRichTextEditor();
  }

  private initRichTextEditor() {
    this.editorInit = {
      base_url: '/tinymce',
      suffix: '.min',
      font_size_formats: '10px 12px 14px 16px 18px 20px 24px 28px 32px 48px',
      line_height_formats:
        '10px 16px 18px 20px 24px 27px 30px 33px 36px 40px 48px',
      images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg',
      images_reuse_filename: true,
      image_advtab: true,
      block_unsupported_drop: true,
      content_style: 'img {max-width: 100%;}',
      images_upload_handler: (blobInfo) => {
        const objectKey = `${
          this.imageUploadPrefix
        }/${Date.now()}-${blobInfo.filename()}`;
        const file = new File([blobInfo.blob()], objectKey);
        const promise = lastValueFrom(
          this.s3Service.getPutPresigned(objectKey).pipe(
            concatMap((putPresignedObject) => {
              return this.s3Service
                .putPresigned(putPresignedObject.presigned.URL, file, {
                  headers: {
                    'Content-Type':
                      blobInfo.blob()?.type ?? 'application/octet-stream',
                  },
                })
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
}
