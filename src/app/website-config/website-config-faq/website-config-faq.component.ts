import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button/button.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';

@Component({
  selector: 'app-website-config-faq',
  standalone: true,
  imports: [ButtonComponent, InputTextComponent, TextareaComponent],
  templateUrl: './website-config-faq.component.html',
  styleUrl: './website-config-faq.component.scss',
})
export class WebsiteConfigFaqComponent implements OnInit {
  @Input() formArray: FormArray;

  protected form: FormGroup;
  protected isEdit = false;

  ngOnInit(): void {
    this.form = new FormGroup({
      question: new FormControl(null, Validators.required),
      answer: new FormControl(null, Validators.required),
    });
  }

  onAddQuestionClick() {
    this.isEdit = true;
  }

  getFaqItemFormGroup(index: number) {
    return this.formArray.at(index);
  }
}
