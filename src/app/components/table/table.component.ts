import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableCellTemplateComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: any[];
  @Input() data: any[];
  @Input() boldColumnIndexes: number[] = [];
  @Input() compactColumnIndexes: number[] = [];
}
