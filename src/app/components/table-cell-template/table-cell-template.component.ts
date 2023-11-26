import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ColumnTypeEnum } from '../../shared/enums/column-type';
import { SVGDownloadComponent } from '../svg/download/download.component';
import { SvgCheckComponent } from '../svg/svg-check/svg-check.component';

@Component({
  selector: 'app-table-cell-template',
  standalone: true,
  imports: [CommonModule, SVGDownloadComponent, SvgCheckComponent],
  templateUrl: './table-cell-template.component.html',
  styleUrls: ['./table-cell-template.component.scss'],
})
export class TableCellTemplateComponent {
  @Input() cellType?: ColumnTypeEnum;
  @Input() cellValue: string;
  @Input() bold = false;

  protected hoverOverDownloadLink = false;

  onDownloadIconClicked(e: MouseEvent) {
    e.stopPropagation();
  }

  onMouseEnterDownloadLink() {
    this.hoverOverDownloadLink = true;
  }

  onMouseLeaveDownloadLink() {
    this.hoverOverDownloadLink = false;
  }

  onMouseDownDownloadLink() {
    this.hoverOverDownloadLink = false;
  }
}
