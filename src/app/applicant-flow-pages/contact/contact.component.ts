import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';

@Component({
  selector: 'app-applicant-contact',
  standalone: true,
  imports: [CommonModule, InputTextComponent, CheckboxComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  protected formTouched = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  get projectCoordinatorEmailControl(): FormControl {
    return this.form.get('contact.projectCoordinator.email') as FormControl;
  }

  get projectCoordinatorPhoneNumberControl(): FormControl {
    return this.form.get(
      'contact.projectCoordinator.phoneNumber'
    ) as FormControl;
  }

  get projectHeadGroup(): FormGroup {
    return this.form.get('contact.projectHead') as FormGroup;
  }

  get projectManagerGroup(): FormGroup {
    return this.form.get('contact.projectManager') as FormGroup;
  }

  get projectCoordinatorGroup(): FormGroup {
    return this.form.get('contact.projectCoordinator') as FormGroup;
  }

  get projectManagerSameAsProjectHead(): boolean {
    return this.form.value.contact.projectManager.sameAsProjectHead;
  }

  get projectCoordinatorSameAsProjectHead(): boolean {
    return this.form.value.contact.projectCoordinator.sameAsProjectHead;
  }

  get projectCoordinatorSameAsProjectManager(): boolean {
    return this.form.value.contact.projectCoordinator.sameAsProjectManager;
  }

  constructor() {
    this.onProjectManagerSameAsProjectHeadChanged =
      this.onProjectManagerSameAsProjectHeadChanged.bind(this);
    this.onProjectCoordinatorSameAsProjectHeadChanged =
      this.onProjectCoordinatorSameAsProjectHeadChanged.bind(this);
    this.onProjectCoordinatorSameAsProjectManagerChanged =
      this.onProjectCoordinatorSameAsProjectManagerChanged.bind(this);
  }

  public validToGoNext(): boolean {
    if (this.projectManagerSameAsProjectHead) {
      this.patchProjectManager();
    }

    if (this.projectCoordinatorSameAsProjectHead) {
      this.patchProjectCoordinator(this.projectHeadGroup);
    } else if (this.projectCoordinatorSameAsProjectManager) {
      this.patchProjectCoordinator(this.projectManagerGroup);
    }

    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  private patchProjectCoordinator(copyFrom: FormGroup) {
    const { prefix, firstName, lastName, organizationPosition, eventPosition } =
      copyFrom.value;
    this.projectCoordinatorGroup.patchValue({
      prefix,
      firstName,
      lastName,
      organizationPosition,
      eventPosition,
    });
  }

  protected onProjectManagerSameAsProjectHeadChanged() {
    if (!this.projectCoordinatorSameAsProjectHead) {
      this.resetProjectManager();
    }
  }

  protected onProjectCoordinatorSameAsProjectHeadChanged() {
    console.log('==same Head');
    if (!this.projectCoordinatorSameAsProjectHead) {
      this.resetProjectCoordinator();
    } else {
      this.projectCoordinatorGroup.patchValue({
        sameAsProjectManager: false,
      });
    }
  }

  protected onProjectCoordinatorSameAsProjectManagerChanged() {
    console.log('==same Manager');
    if (!this.projectCoordinatorSameAsProjectManager) {
      this.resetProjectCoordinator();
    } else {
      this.projectCoordinatorGroup.patchValue({
        sameAsProjectHead: false,
      });
    }
  }

  private resetProjectManager() {
    this.projectManagerGroup.patchValue({
      prefix: null,
      firstName: null,
      lastName: null,
      organizationPosition: null,
      eventPosition: null,
    });
    this.projectManagerGroup.markAsPristine();
    this.projectManagerGroup.markAsUntouched();
  }

  private resetProjectCoordinator() {
    const group = this.projectCoordinatorGroup;
    this.projectCoordinatorGroup.patchValue({
      prefix: null,
      firstName: null,
      lastName: null,
      organizationPosition: null,
      eventPosition: null,
    });
    const fields = [
      'prefix',
      'firstName',
      'lastName',
      'organizationPosition',
      'eventPosition',
    ];
    fields.forEach((field) => {
      group.get(field)?.markAsPristine();
      group.get(field)?.markAsUntouched();
    });
  }

  private patchProjectManager() {
    const { prefix, firstName, lastName, organizationPosition, eventPosition } =
      this.projectHeadGroup.value;
    this.projectManagerGroup.patchValue({
      prefix,
      firstName,
      lastName,
      organizationPosition,
      eventPosition,
    });
  }

  private isFormValid(): boolean {
    return this.form.get('contact')?.valid ?? false;
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('contact');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const fromGroup = this.form.get('contact') as FormGroup;
    const errorId = this.getFirstErrorIdWithPrefix(fromGroup, '');
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }
}
