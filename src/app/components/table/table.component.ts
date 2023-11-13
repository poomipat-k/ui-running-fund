import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() keyColumnIndex = 0;
  @Input() emptyText: string;

  routerService: Router = inject(Router);

  onRowClicked(projectCode: string) {
    this.routerService.navigate(['/review/project', projectCode]);
  }
}
