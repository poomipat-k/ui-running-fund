import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ColumnTypeEnum } from '../../shared/enums/column-type';
import { SVGDownloadComponent } from '../svg/download/download.component';

@Component({
  selector: 'app-table-cell-template',
  standalone: true,
  imports: [CommonModule, SVGDownloadComponent],
  templateUrl: './table-cell-template.component.html',
  styleUrls: ['./table-cell-template.component.scss'],
})
export class TableCellTemplateComponent {
  @Input() cellType?: ColumnTypeEnum;
  @Input() cellValue: string;

  protected hoverOverDowloadLink = false;

  onDowloadIconClicked(e: MouseEvent) {
    e.stopPropagation();
  }

  onMouseEnterDownloadLink() {
    this.hoverOverDowloadLink = true;
  }

  onMouseLeaveDownloadLink() {
    this.hoverOverDowloadLink = false;
  }

  onMouseDownDownloadLink() {
    this.hoverOverDowloadLink = false;
  }
}
