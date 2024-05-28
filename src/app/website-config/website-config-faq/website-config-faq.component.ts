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

  public isEditing = false;
  public action: 'add' | 'edit' = 'add';
  protected editingIndex = -1;

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

  public validToBeSubmit(): boolean {
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
    this.form.reset();
  }

  public editFaqItem() {
    const index = this.editingIndex;
    const control = this.formArray.at(index);
    if (!control) {
      console.warn(`faq[${index}] control not found`);
      return;
    }
    control.patchValue({
      question: this.form.value?.question,
      answer: this.form.value?.answer,
    });
  }

  onDeleteQuestion(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.formArray.removeAt(index);
  }

  private markFieldsTouched() {
    this.form.markAllAsTouched();
  }

  private isFormValid(): boolean {
    return this.form?.valid ?? false;
  }

  changeIsEditingTo(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  changeActionTo(action: 'add' | 'edit') {
    this.action = action;
  }

  onAddNewItemButtonClick() {
    this.form.reset();
    this.changeActionTo('add');
    this.changeIsEditingTo(true);
  }

  onFaqItemRowClick(index: number) {
    this.form.reset();
    this.changeActionTo('edit');
    this.changeIsEditingTo(true);
    const editingControl = this.formArray.at(index);
    if (!editingControl) {
      return;
    }
    this.editingIndex = index;
    this.form.patchValue({
      question: editingControl.value.question,
      answer: editingControl.value.answer,
    });
  }

  getFaqItemFormGroup(index: number) {
    return this.formArray.at(index);
  }
}
