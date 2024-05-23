import { Component, Input, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { concatMap, lastValueFrom, map } from 'rxjs';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { S3Service } from '../../services/s3.service';

@Component({
  selector: 'app-website-config-how-to-create',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, InputTextComponent],
  templateUrl: './website-config-how-to-create.component.html',
  styleUrl: './website-config-how-to-create.component.scss',
})
export class WebsiteConfigHowToCreateComponent {
  @Input() formArray: FormArray;

  private readonly s3Service: S3Service = inject(S3Service);

  protected editorInit: EditorComponent['init'] = {};
  protected editorPlugins =
    'preview autolink autosave save code visualblocks visualchars fullscreen image link media codesample table charmap nonbreaking anchor lists advlist wordcount help charmap quickbars emoticons';
  protected editorToolbar =
    'undo redo | blocks fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | anchor codesample';

  ngOnInit(): void {
    this.initRichTextEditor();
  }

  // modelChangeFn(e: any) {
  //   this.form.patchValue({ content: e });
  //   console.log(this.contentControl.value);
  // }

  getFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  genLabelName(index: number): string {
    return `หัวข้อ ${index + 1}`;
  }

  genContentName(index: number): string {
    return `เนื้อหา ${index + 1}`;
  }

  genPlaceHolder(index: number): string {
    return `Step ${index + 1}`;
  }

  addFormItem() {
    this.formArray.push(
      new FormGroup({
        header: new FormControl(null, Validators.required),
        content: new FormControl(null, Validators.required),
      })
    );
  }

  removeFormItem(index: number) {
    this.formArray.removeAt(index);
  }

  private initRichTextEditor() {
    this.editorInit = {
      base_url: '/tinymce',
      suffix: '.min',
      font_size_formats: '10px 12px 14px 16px 18px 20px 24px 28px 32px 48px',
      line_height_formats: '10px 16px 18px 20px 24px 30px 33px 36px',
      images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg',
      images_reuse_filename: true,
      block_unsupported_drop: true,
      images_upload_handler: (blobInfo) => {
        const objectKey = `cms/howToCreate/${Date.now()}-${blobInfo.filename()}`;
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
}
