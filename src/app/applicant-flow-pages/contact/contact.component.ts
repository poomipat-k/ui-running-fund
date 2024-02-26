import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
import { AddressService } from '../../services/address.service';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-contact',
  standalone: true,
  imports: [
    CommonModule,
    InputTextComponent,
    CheckboxComponent,
    RadioComponent,
    SelectDropdownComponent,
    OnlyNumberDirective,
    TextareaComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() enableScroll = false;
  @Input() devModeOn = false;

  private readonly addressService: AddressService = inject(AddressService);

  protected formTouched = false;

  protected provinceOptions: RadioOption[] = [];
  protected districtOptions: RadioOption[] = [];
  protected subdistrictOptions: RadioOption[] = [];
  protected postcodeOptions: RadioOption[] = [];

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  get projectCoordinatorEmailControl(): FormControl {
    return this.form.get('contact.projectCoordinator.email') as FormControl;
  }

  get projectCoordinatorLineIdControl(): FormControl {
    return this.form.get('contact.projectCoordinator.lineId') as FormControl;
  }

  get projectCoordinatorPhoneNumberControl(): FormControl {
    return this.form.get(
      'contact.projectCoordinator.phoneNumber'
    ) as FormControl;
  }

  get coordinatorAddressFormGroup(): FormGroup {
    return this.form.get('contact.projectCoordinator.address') as FormGroup;
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

  get organizationGroup(): FormGroup {
    return this.form.get('contact.organization') as FormGroup;
  }

  get raceDirectorGroup(): FormGroup {
    return this.form.get('contact.raceDirector') as FormGroup;
  }

  get raceDirectorAlternativeGroup(): FormGroup {
    return this.form.get('contact.raceDirector.alternative') as FormGroup;
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

  get isOtherRaceDirector(): boolean {
    return this.form.value.contact.raceDirector.who === 'other';
  }

  protected orgTypeOptions: RadioOption[] = [
    {
      id: 1,
      value: 'government',
      display: 'ภาครัฐ',
    },
    {
      id: 2,
      value: 'private_sector',
      display: 'ภาคเอกชน',
    },
    {
      id: 3,
      value: 'civil_society',
      display: 'ภาคประชาสังคม (เช่น มูลนิธิ ชมรม NGO)',
    },
  ];

  protected raceDirectorOptions: RadioOption[] = [
    {
      id: 1,
      display: 'หัวหน้าโครงการ',
      value: 'projectHead',
    },
    {
      id: 2,
      display: 'ผู้รับผิดชอบโครงการ',
      value: 'projectManager',
    },
    {
      id: 3,
      display: 'ผู้ประสานงาน',
      value: 'projectCoordinator',
    },
    {
      id: 4,
      display: 'คนอื่น โปรดระบุ',
      value: 'other',
    },
  ];

  private readonly subs: Subscription[] = [];

  constructor() {
    this.onProjectManagerSameAsProjectHeadChanged =
      this.onProjectManagerSameAsProjectHeadChanged.bind(this);
    this.onProjectCoordinatorSameAsProjectHeadChanged =
      this.onProjectCoordinatorSameAsProjectHeadChanged.bind(this);
    this.onProjectCoordinatorSameAsProjectManagerChanged =
      this.onProjectCoordinatorSameAsProjectManagerChanged.bind(this);
    this.onRaceDirectorWhoChanged = this.onRaceDirectorWhoChanged.bind(this);

    this.onProvinceChanged = this.onProvinceChanged.bind(this);
    this.onDistrictChanged = this.onDistrictChanged.bind(this);
    this.onSubdistrictChanged = this.onSubdistrictChanged.bind(this);
  }

  ngOnInit(): void {
    this.getProvinces();

    const provinceId =
      this.form.value?.contact?.projectCoordinator?.address?.provinceId;
    const districtId =
      this.form.value?.contact?.projectCoordinator?.address?.districtId;
    const subdistrictId =
      this.form.value?.contact?.projectCoordinator?.address?.subdistrictId;

    if (provinceId) {
      this.getDistrictsByProvinceId(provinceId);
    }
    if (districtId) {
      this.getSubdistrictsByDistrictId(districtId);
    }
    if (subdistrictId) {
      this.getPostcodeBySubdistrictId(subdistrictId);
    }
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

  onRaceDirectorWhoChanged() {
    if (this.isOtherRaceDirector) {
      this.raceDirectorGroup.addControl(
        'alternative',
        new FormGroup({
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
        })
      );
      return;
    }
    if (this.raceDirectorAlternativeGroup) {
      this.raceDirectorGroup.removeControl('alternative');
    }
  }

  onProvinceChanged() {
    this.coordinatorAddressFormGroup.patchValue({
      districtId: null,
      subdistrictId: null,
    });
    const provinceId =
      this.form.value.contact.projectCoordinator.address.provinceId;
    this.getDistrictsByProvinceId(provinceId);
  }

  onDistrictChanged() {
    // Clear subdistrict
    this.coordinatorAddressFormGroup.patchValue({ subdistrictId: null });
    const districtId =
      this.form.value.contact.projectCoordinator.address.districtId;
    this.getSubdistrictsByDistrictId(districtId);
  }

  onSubdistrictChanged() {
    // Clear postcode
    this.coordinatorAddressFormGroup.patchValue({ postcodeId: null });
    const subdistrictId =
      this.form.value.contact.projectCoordinator.address.subdistrictId;
    this.getPostcodeBySubdistrictId(subdistrictId);
  }

  protected onProjectManagerSameAsProjectHeadChanged() {
    if (!this.projectManagerSameAsProjectHead) {
      this.resetProjectManager();
    }
  }

  protected onProjectCoordinatorSameAsProjectHeadChanged() {
    if (!this.projectCoordinatorSameAsProjectHead) {
      this.resetProjectCoordinator();
    } else {
      this.projectCoordinatorGroup.patchValue({
        sameAsProjectManager: false,
      });
    }
  }

  protected onProjectCoordinatorSameAsProjectManagerChanged() {
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

  private getProvinces() {
    this.subs.push(
      this.addressService.getProvinces().subscribe((result) => {
        if (result && result?.length > 0) {
          this.provinceOptions = result.map((p) => ({
            id: p.id,
            value: p.id,
            display: p.name,
          }));
        }
      })
    );
  }

  private getDistrictsByProvinceId(provinceId: number) {
    this.subs.push(
      this.addressService
        .getDistrictsByProvinceId(provinceId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            this.districtOptions = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
          }
        })
    );
  }

  private getSubdistrictsByDistrictId(districtId: number) {
    this.subs.push(
      this.addressService
        .getSubdistrictsByDistrictId(districtId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            this.subdistrictOptions = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
          }
        })
    );
  }

  private getPostcodeBySubdistrictId(subdistrictId: number) {
    this.subs.push(
      this.addressService
        .getPostcodesBySubdistrictId(subdistrictId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            this.postcodeOptions = result.map((post) => ({
              id: post.id,
              value: post.id,
              display: post.code,
            }));
          }
        })
    );
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
