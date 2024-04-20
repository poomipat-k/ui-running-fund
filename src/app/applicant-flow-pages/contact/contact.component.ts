import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
export class ContactComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() enableScroll = false;
  @Input() devModeOn = false;

  private readonly addressService: AddressService = inject(AddressService);

  protected formTouched = false;

  protected provinceOptions: RadioOption[] = [];

  protected projectHeadDistrictOptions: RadioOption[] = [];
  protected projectHeadSubdistrictOptions: RadioOption[] = [];
  protected projectHeadPostcodeOptions: RadioOption[] = [];

  protected projectManagerDistrictOptions: RadioOption[] = [];
  protected projectManagerSubdistrictOptions: RadioOption[] = [];
  protected projectManagerPostcodeOptions: RadioOption[] = [];

  protected projectCoordinatorDistrictOptions: RadioOption[] = [];
  protected projectCoordinatorSubdistrictOptions: RadioOption[] = [];
  protected projectCoordinatorPostcodeOptions: RadioOption[] = [];

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  get projectHeadEmailControl(): FormControl {
    return this.form.get('contact.projectHead.email') as FormControl;
  }

  get projectManagerEmailControl(): FormControl {
    return this.form.get('contact.projectManager.email') as FormControl;
  }

  get projectCoordinatorEmailControl(): FormControl {
    return this.form.get('contact.projectCoordinator.email') as FormControl;
  }

  get projectHeadLineIdControl(): FormControl {
    return this.form.get('contact.projectHead.lineId') as FormControl;
  }

  get projectManagerLineIdControl(): FormControl {
    return this.form.get('contact.projectManager.lineId') as FormControl;
  }

  get projectCoordinatorLineIdControl(): FormControl {
    return this.form.get('contact.projectCoordinator.lineId') as FormControl;
  }

  get projectHeadPhoneNumberControl(): FormControl {
    return this.form.get('contact.projectHead.phoneNumber') as FormControl;
  }

  get projectManagerPhoneNumberControl(): FormControl {
    return this.form.get('contact.projectManager.phoneNumber') as FormControl;
  }

  get projectCoordinatorPhoneNumberControl(): FormControl {
    return this.form.get(
      'contact.projectCoordinator.phoneNumber'
    ) as FormControl;
  }

  get projectHeadAddressFormGroup(): FormGroup {
    return this.form.get('contact.projectHead.address') as FormGroup;
  }

  get projectManagerAddressFormGroup(): FormGroup {
    return this.form.get('contact.projectManager.address') as FormGroup;
  }

  get projectCoordinatorAddressFormGroup(): FormGroup {
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

    // On Province changed
    this.onProjectHeadProvinceChanged =
      this.onProjectHeadProvinceChanged.bind(this);
    this.onProjectManagerProvinceChanged =
      this.onProjectManagerProvinceChanged.bind(this);
    this.onProjectCoordinatorProvinceChanged =
      this.onProjectCoordinatorProvinceChanged.bind(this);

    // On district changed
    this.onProjectHeadDistrictChanged =
      this.onProjectHeadDistrictChanged.bind(this);
    this.onProjectManagerDistrictChanged =
      this.onProjectManagerDistrictChanged.bind(this);
    this.onProjectCoordinatorDistrictChanged =
      this.onProjectCoordinatorDistrictChanged.bind(this);

    // On subdistrict changed
    this.onProjectHeadSubdistrictChanged =
      this.onProjectHeadSubdistrictChanged.bind(this);
    this.onProjectManagerSubdistrictChanged =
      this.onProjectManagerSubdistrictChanged.bind(this);
    this.onProjectCoordinatorSubdistrictChanged =
      this.onProjectCoordinatorSubdistrictChanged.bind(this);
  }

  ngOnInit(): void {
    this.getProvinces();

    this.configAddress('projectHead');
    this.configAddress('projectManager');
    this.configAddress('projectCoordinator');
  }

  private configAddress(groupName: string) {
    const provinceId =
      this.form.value?.contact?.[groupName]?.address?.provinceId;
    const districtId =
      this.form.value?.contact?.[groupName]?.address?.districtId;
    const subdistrictId =
      this.form.value?.contact?.[groupName]?.address?.subdistrictId;

    // load address data when init
    if (provinceId) {
      this.getDistrictsByProvinceId(provinceId, groupName);
    }
    if (districtId) {
      this.getSubdistrictsByDistrictId(districtId, groupName);
    }
    if (subdistrictId) {
      this.getPostcodeBySubdistrictId(subdistrictId, groupName);
    }

    // load address data when some field changed
    const provinceControl = this.form.get(
      `contact.${groupName}.address.provinceId`
    ) as FormControl;
    const districtControl = this.form.get(
      `contact.${groupName}.address.districtId`
    ) as FormControl;
    const subdistrictControl = this.form.get(
      `contact.${groupName}.address.subdistrictId`
    ) as FormControl;

    this.subs.push(
      provinceControl.valueChanges.subscribe((provinceId) => {
        if (provinceId) {
          this.getDistrictsByProvinceId(provinceId, groupName);
        }
      })
    );
    this.subs.push(
      districtControl.valueChanges.subscribe((districtId) => {
        if (districtId) {
          this.getSubdistrictsByDistrictId(districtId, groupName);
        }
      })
    );
    this.subs.push(
      subdistrictControl.valueChanges.subscribe((subdistrictId) => {
        if (subdistrictId) {
          this.getPostcodeBySubdistrictId(subdistrictId, groupName);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  public validToGoNext(): boolean {
    if (this.projectManagerSameAsProjectHead) {
      this.patchProjectManagerAsProjectHead();
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
    console.log('==form', this.form);
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

  onProjectHeadProvinceChanged() {
    this.projectHeadAddressFormGroup.patchValue({
      districtId: null,
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectManagerProvinceChanged() {
    this.projectManagerAddressFormGroup.patchValue({
      districtId: null,
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectCoordinatorProvinceChanged() {
    this.projectCoordinatorAddressFormGroup.patchValue({
      districtId: null,
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectHeadDistrictChanged() {
    this.projectHeadAddressFormGroup.patchValue({
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectManagerDistrictChanged() {
    this.projectManagerAddressFormGroup.patchValue({
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectCoordinatorDistrictChanged() {
    this.projectCoordinatorAddressFormGroup.patchValue({
      subdistrictId: null,
      postcodeId: null,
    });
  }

  onProjectHeadSubdistrictChanged() {
    this.projectHeadAddressFormGroup.patchValue({ postcodeId: null });
  }
  onProjectManagerSubdistrictChanged() {
    this.projectManagerAddressFormGroup.patchValue({ postcodeId: null });
  }
  onProjectCoordinatorSubdistrictChanged() {
    this.projectCoordinatorAddressFormGroup.patchValue({ postcodeId: null });
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
      address: {
        address: null,
        provinceId: null,
        districtId: null,
        subdistrictId: null,
        postcodeId: null,
      },
      email: null,
      lineId: null,
      phoneNumber: null,
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
      address: {
        address: null,
        provinceId: null,
        districtId: null,
        subdistrictId: null,
        postcodeId: null,
      },
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

  private patchProjectManagerAsProjectHead() {
    const {
      prefix,
      firstName,
      lastName,
      organizationPosition,
      eventPosition,
      address,
      email,
      lineId,
      phoneNumber,
    } = this.projectHeadGroup.value;
    this.projectManagerGroup.patchValue({
      prefix,
      firstName,
      lastName,
      organizationPosition,
      eventPosition,
      address: { ...address },
      email,
      lineId,
      phoneNumber,
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
    console.error('errorId:', errorId);
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

  private getDistrictsByProvinceId(provinceId: number, groupName: string) {
    this.subs.push(
      this.addressService
        .getDistrictsByProvinceId(provinceId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            const districtList = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
            if (groupName === 'projectHead') {
              this.projectHeadDistrictOptions = districtList;
            } else if (groupName === 'projectManager') {
              this.projectManagerDistrictOptions = districtList;
            } else if (groupName === 'projectCoordinator') {
              this.projectCoordinatorDistrictOptions = districtList;
            }
          }
        })
    );
  }

  private getSubdistrictsByDistrictId(districtId: number, groupName: string) {
    this.subs.push(
      this.addressService
        .getSubdistrictsByDistrictId(districtId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            const subdistrictList = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
            if (groupName === 'projectHead') {
              this.projectHeadSubdistrictOptions = subdistrictList;
            } else if (groupName === 'projectManager') {
              this.projectManagerSubdistrictOptions = subdistrictList;
            } else if (groupName === 'projectCoordinator') {
              this.projectCoordinatorSubdistrictOptions = subdistrictList;
            }
          }
        })
    );
  }

  private getPostcodeBySubdistrictId(subdistrictId: number, groupName: string) {
    this.subs.push(
      this.addressService
        .getPostcodesBySubdistrictId(subdistrictId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            const postcodeList = result.map((post) => ({
              id: post.id,
              value: post.id,
              display: post.code,
            }));
            if (groupName === 'projectHead') {
              this.projectHeadPostcodeOptions = postcodeList;
            } else if (groupName === 'projectManager') {
              this.projectManagerPostcodeOptions = postcodeList;
            } else if (groupName === 'projectCoordinator') {
              this.projectCoordinatorPostcodeOptions = postcodeList;
            }
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

  patchForm() {
    const group = this.form.get('contact') as FormGroup;
    group.patchValue({
      projectHead: {
        prefix: 'Mr',
        firstName: 'A',
        lastName: 'B',
        organizationPosition: 'software eng',
        eventPosition: 'Judge',
        address: {
          address: 'projectHead address',
          provinceId: 1,
          districtId: 1,
          subdistrictId: 1,
          postcodeId: 1,
        },
        email: 'head@test.com',
        lineId: '@head',
        phoneNumber: '091111111',
      },
      projectManager: {
        // sameAsProjectHead: true,
        sameAsProjectHead: false,
        prefix: 'Mr',
        firstName: 'A',
        lastName: 'B',
        organizationPosition: 'software eng',
        eventPosition: 'Judge',
        address: {
          address: 'projectManager address',
          provinceId: 2,
          districtId: 10,
          subdistrictId: 60,
          postcodeId: 60,
        },
        email: 'projectManager@test.com',
        lineId: '@projectManager',
        phoneNumber: '091111111',
      },
      projectCoordinator: {
        // sameAsProjectHead: true,
        sameAsProjectHead: false,
        sameAsProjectManager: false,
        prefix: 'Mr',
        firstName: 'A',
        lastName: 'B',
        organizationPosition: 'software eng',
        eventPosition: 'Judge',
        address: {
          address: 'projectManager address',
          provinceId: 6,
          districtId: 113,
          subdistrictId: 652,
          postcodeId: 666,
        },
        email: 'coordinator@test.com',
        lineId: '@coordinator',
        phoneNumber: '0902029423',
      },
      raceDirector: {
        who: 'projectHead',
      },
      organization: {
        type: 'civil_society',
        name: 'NGO',
      },
    });
  }
}
