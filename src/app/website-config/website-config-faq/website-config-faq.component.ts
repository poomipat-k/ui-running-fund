import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() faqEditModeChanged = new EventEmitter<boolean>();

  public isEdit = false;

  protected form: FormGroup;
  protected formTouched = false;

  get questionControl(): FormControl {
    return this.form.get('question') as FormControl;
  }

  get answerControl(): FormControl {
    return this.form.get('answer') as FormControl;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      question: new FormControl(null, Validators.required),
      answer: new FormControl(null, Validators.required),
    });
  }

  public validToBeAdded(): boolean {
    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  public addToFaqFormArray() {
    this.formArray.push(
      new FormGroup({
        id: new FormControl(null),
        question: new FormControl(
          this.form.value.question,
          Validators.required
        ),
        answer: new FormControl(this.form.value.answer, Validators.required),
      })
    );
  }

  private markFieldsTouched() {
    this.form.markAllAsTouched();
  }

  private isFormValid(): boolean {
    return this.form?.valid ?? false;
  }

  changeIsEdit(isEdit: boolean) {
    this.isEdit = isEdit;
    this.faqEditModeChanged.emit(isEdit);
  }

  getFaqItemFormGroup(index: number) {
    return this.formArray.at(index);
  }
}
