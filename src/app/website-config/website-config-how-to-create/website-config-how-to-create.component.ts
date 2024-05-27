import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CancelConfirmModalComponent } from '../../components/cancel-confirm-modal/cancel-confirm-modal.component';
import { CustomEditorComponent } from '../../components/custom-editor/custom-editor.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';

@Component({
  selector: 'app-website-config-how-to-create',
  standalone: true,
  imports: [
    InputTextComponent,
    CancelConfirmModalComponent,
    CustomEditorComponent,
  ],
  templateUrl: './website-config-how-to-create.component.html',
  styleUrl: './website-config-how-to-create.component.scss',
})
export class WebsiteConfigHowToCreateComponent {
  @ViewChild('deleteItemModal')
  deleteItemModalComponent: CancelConfirmModalComponent;

  protected imageUploadPrefix = 'cms/how_to_create';
  protected removingItemIndex = 0;

  @Input() formArray: FormArray;

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

  removeFormItemClick(index: number) {
    this.removingItemIndex = index;
    this.deleteItemModalComponent.showModal();
  }

  doRemoveFormItem() {
    this.formArray.removeAt(this.removingItemIndex);
    this.deleteItemModalComponent.closeModal();
  }
}
