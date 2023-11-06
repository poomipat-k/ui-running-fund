import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TableCell } from 'src/app/models/table-cell';
import { TableColumn } from 'src/app/models/table-column';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableCellTemplateComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: TableColumn[];
  @Input() data: TableCell[][];
  @Input() idColumnIndex = 0;

  routerService: Router = inject(Router);
  protected clickedId: string;

  onRowClicked(id: string) {
    this.routerService.navigate(['/review/project', id]);
  }
}
