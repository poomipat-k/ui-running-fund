import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxViewComponent } from '../../components/checkbox-view/checkbox-view.component';
import { RadioViewComponent } from '../../components/radio-view/radio-view.component';
import { RadioOption } from '../../shared/models/radio-option';

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
  @Input() projectName = '';
  @Input() projectCode = '';
  @Input() hadReceivedFundValue = false;

  protected projectLeader = 'นายขอทุน สนับสนุน';
  protected projectLocation = 'กาดหลวง เชียงใหม่';
  protected projectStartDate = '20 ธันวาคม 2566 เวลา 05:00 น. - 10:00 น.';

  protected projectTypeCheckBox = [
    {
      id: 1,
      display: 'Fun Run',
      value: 'fun_run',
      name: 'fun_run',
      checked: false,
    },
    { id: 2, display: '<5km', value: '5km', name: '5km', checked: false },
    { id: 3, display: '<10km', value: '10km', name: '10km', checked: true },
    { id: 4, display: '<20km', value: '20km', name: '20km', checked: true },
    { id: 5, display: '<42km', value: '42km', name: '42km', checked: false },
    {
      id: 6,
      display: 'Others',
      value: 'others',
      name: 'others',
      checked: false,
    },
  ];

  protected expectedRunner = '1,000 คน';
  protected targetGroup = 'วัยรุ่นและผู้ใหญ่';

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
}
