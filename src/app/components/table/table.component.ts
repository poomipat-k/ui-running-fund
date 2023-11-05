import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';
import { TableColumn } from 'src/app/models/table-column';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableCellTemplateComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: TableColumn[];
  @Input() data: any[];
}
