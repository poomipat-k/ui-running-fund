import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ColumnTypeEnum } from 'src/app/enums/column-type';

@Component({
  selector: 'app-table-cell-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-cell-template.component.html',
  styleUrls: ['./table-cell-template.component.scss'],
})
export class TableCellTemplateComponent {
  @Input() cellType?: ColumnTypeEnum;
  @Input() cellValue: string;
}
