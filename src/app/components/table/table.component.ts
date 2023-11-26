import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableCell } from '../../shared/models/table-cell';
import { TableColumn } from '../../shared/models/table-column';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';

@Component({
  selector: 'app-com-table',
  standalone: true,
  imports: [CommonModule, TableCellTemplateComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: TableColumn[];
  @Input() data: TableCell[][] = [];
  @Input() emptyText: string;
  @Input() stripeRows = true;
  @Input() headerGray = false;
  @Input() rowClickable = false;

  @Output() rowClicked = new EventEmitter<TableCell[]>();
}
