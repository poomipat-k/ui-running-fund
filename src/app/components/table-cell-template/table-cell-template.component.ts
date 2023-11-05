import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-cell-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-cell-template.component.html',
  styleUrls: ['./table-cell-template.component.scss'],
})
export class TableCellTemplateComponent {
  @Input() cellType: string;
  @Input() cellValue: unknown;
}
