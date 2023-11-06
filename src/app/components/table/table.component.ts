import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { TableCellTemplateComponent } from '../table-cell-template/table-cell-template.component';
import { TableColumn } from 'src/app/models/table-column';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableCellTemplateComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: TableColumn[];
  @Input() data: string[][];
  @Input() idColumnIndex = 0;

  routerService: Router = inject(Router);
  protected clickedId: string;

  onRowClicked(id: string) {
    this.routerService.navigate(['/review/project', id]);
  }
}
