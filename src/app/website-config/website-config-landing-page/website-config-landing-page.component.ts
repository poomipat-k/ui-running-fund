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
