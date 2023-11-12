import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';

@Component({
  selector: 'app-review-general-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxComponent],
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
})
export class GeneralDetailsComponent {
  protected projectName = 'ชื่อโครงการขอทุนสนับสนุน';
  protected projectCode = 'Unique ID';
  protected projectLeader = 'นายขอทุน สนับสนุน';
  protected projectLocation = 'กาดหลวง เชียงใหม่';

  protected projectTypeCheckBox = [
    { id: 1, display: 'Fun Run', value: 'fun_run', name: 'fun_run' },
    { id: 2, display: '<5km', value: '5km', name: '5km' },
    { id: 3, display: '<10km', value: '10km', name: '10km' },
    { id: 4, display: '<20km', value: '20km', name: '20km' },
    { id: 5, display: '<42km', value: '42km', name: '42km' },
    { id: 6, display: 'Others', value: 'others', name: 'others' },
  ];
}
