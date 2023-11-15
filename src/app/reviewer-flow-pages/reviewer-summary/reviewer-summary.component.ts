import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { TableCell } from '../../shared/models/table-cell';
import { TableColumn } from '../../shared/models/table-column';
import { criteiaGroup } from '../data/criteria-group';
import { ReviewCriteria } from '../../shared/models/review-criteria';

@Component({
  selector: 'app-reviewer-summary',
  standalone: true,
  imports: [CommonModule, TableComponent],
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
    },
  ];

  get data(): TableCell[][] {
    let result: TableCell[][] = [];
    if (criteiaGroup) {
      let j = 0;
      for (let i = 0; i < criteiaGroup.length; i++) {
        const topic = criteiaGroup[i].groupName;
        let sumScore = 0;
        for (; j < this.criteriaList.length; j++) {
          const criteria = this.criteriaList[j];
          if (criteria.group_number === i + 1) {
            const score =
              this.form?.value?.score[
                `${criteria.criteria_version}_${criteria.order_number}`
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
        result.push(row);
      }
    }
    return result;
  }
}
