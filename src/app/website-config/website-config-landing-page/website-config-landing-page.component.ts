import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-website-config-landing-page',
  standalone: true,
  imports: [EditorModule, FormsModule, ReactiveFormsModule, SafeHtmlPipe],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  templateUrl: './website-config-landing-page.component.html',
  styleUrl: './website-config-landing-page.component.scss',
})
export class WebsiteConfigLandingPageComponent implements OnInit {
  form: FormGroup;

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

  ngOnInit(): void {
    this.form = new FormGroup({
      data: new FormControl(null),
    });

    this.dataGroup.valueChanges.subscribe((values) => {
      console.log('==values:', values);
    });
  }

  onClick() {
    console.log('==form', this.form);
  }

  modelChangeFn(e: any) {
    this.form.patchValue({ data: e });
    console.log(this.dataGroup.value);
  }
}
