import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { ReviewCriteria } from '../../shared/models/review-criteria';
import { TableCell } from '../../shared/models/table-cell';
import { TableColumn } from '../../shared/models/table-column';
import { criteriaGroup } from '../data/criteria-group';

@Component({
  selector: 'app-reviewer-summary',
  standalone: true,
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './reviewer-summary.component.html',
  styleUrl: './reviewer-summary.component.scss',
})
export class ReviewerSummaryComponent {
  @Input() form: FormGroup;
  @Input() criteriaList: ReviewCriteria[] = [];

  protected columns: TableColumn[] = [
    {
      name: 'หัวข้อ',
    },
    {
      name: 'คะแนน',
      class: 'col-status',
    },
  ];

  get data(): TableCell[][] {
    let result: TableCell[][] = [];
    if (criteriaGroup) {
      let j = 0;
      let sumTotal = 0;
      for (let i = 0; i < criteriaGroup.length; i++) {
        const topic = criteriaGroup[i].groupName;
        let sumScore = 0;
        for (; j < this.criteriaList.length; j++) {
          const criteria = this.criteriaList[j];
          if (criteria.groupNumber === i + 1) {
            const score =
              this.form?.value?.review.scores[
                `q_${criteria.criteriaVersion}_${criteria.orderNumber}`
              ];
            if (score) {
              sumScore += score;
            }
          } else {
            break;
          }
        }
        const row: TableCell[] = [
          { display: topic, value: topic },
          { display: `${sumScore} คะแนน`, value: sumScore },
        ];
        sumTotal += sumScore;
        result.push(row);
      }
      result.push([
        {
          display: 'คะแนนรวม (เต็ม 100 คะแนน)',
          value: 'คะแนนรวม (เต็ม 100 คะแนน)',
          className: 'bold',
        },
        {
          display: `${sumTotal} คะแนน`,
          value: sumTotal,
          className: 'bold',
        },
      ]);
    }
    return result;
  }
}
