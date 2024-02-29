import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxViewComponent } from '../../components/checkbox-view/checkbox-view.component';
import { RadioViewComponent } from '../../components/radio-view/radio-view.component';
import { DateService } from '../../services/date.service';
import { RadioOption } from '../../shared/models/radio-option';
import { ReviewerProjectDetails } from '../../shared/models/reviewer-project-details';

@Component({
  selector: 'app-review-general-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxViewComponent,
    RadioViewComponent,
  ],
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
})
export class GeneralDetailsComponent {
  @Input() apiData: ReviewerProjectDetails;

  private readonly dateService: DateService = inject(DateService);

  protected _projectDistances: any = {
    fun: {
      display: 'Fun Run',
      value: 'fun',
      checked: false,
      dynamic: false,
    },
    mini: { display: '10km', value: 'mini', checked: false, dynamic: false },
    half: { display: '21.1km', value: 'half', checked: false, dynamic: false },
    full: {
      display: '42.195km',
      value: 'full',
      checked: false,
      dynamic: false,
    },
  };

  get distancesCheckbox() {
    const checkedDistances = this.apiData.distances || [];
    checkedDistances.forEach((item) => {
      if (item.dynamic) {
        this._projectDistances[item.type] = {
          display: item.type,
          value: item.type,
          checked: true,
          dynamic: true,
        };
      } else if (this._projectDistances[item.type]) {
        this._projectDistances[item.type].checked = true;
      }
    });
    const checkboxList = Object.keys(this._projectDistances).map((key) => ({
      display: this._projectDistances[key].display,
      value: this._projectDistances[key].value,
      checked: this._projectDistances[key].checked,
      dynamic: this._projectDistances[key].dynamic,
    }));
    return checkboxList;
  }

  protected readonly expectedParticipantsOptionsMap: { [key: string]: string } =
    {
      '<=500': 'ต่ำกว่า 500 คน',
      '501-1500': '501 - 1,500 คน',
      '1501-2500': '1,501 - 2,500 คน',
      '2501-3500': '2,501 - 3,500 คน',
      '3501-4500': '3,501 - 4,500 คน',
      '4501-5500': '4,501 - 5,500 คน',
      '>=5501': '5,501 คนขึ้นไป',
    };

  protected hadReceivedFundOptions: RadioOption[] = [
    {
      id: 1,
      display: 'ไม่มีการประสานงาน',
      value: false,
    },
    {
      id: 2,
      display: 'มีการประสานงานและมีหนังสือนำส่ง',
      value: true,
    },
  ];

  get projectHeadFullName(): string {
    if (!this.apiData) return '';
    return `${this.apiData.projectHeadPrefix}${this.apiData.projectHeadFirstName} ${this.apiData.projectHeadLastName}`;
  }

  get eventDate(): string {
    if (!this.apiData) return '';
    const from = this.apiData.fromDate;
    const to = this.apiData.toDate;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (!from || !to) {
      return '';
    }
    return `${this.dateService.dateToStringWithLongMonth(from)} เวลา ${fromDate
      ?.getHours()
      ?.toString()
      ?.padStart(2, '0')}:${fromDate
      ?.getMinutes()
      ?.toString()
      ?.padStart(2, '0')} น. - ${toDate
      ?.getHours()
      ?.toString()
      ?.padStart(2, '0')}:${toDate
      .getMinutes()
      ?.toString()
      ?.padStart(2, '0')} น.`;
  }

  get eventAddress(): string {
    return `${this.apiData.address} ${this.apiData.subdistrictName} ${this.apiData.districtName} ${this.apiData.provinceName}`;
  }

  get expectedParticipantsDisplay(): string {
    if (!this.apiData.expectedParticipants) return '';
    return (
      this.expectedParticipantsOptionsMap[this.apiData.expectedParticipants] ||
      ''
    );
  }
}
