import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ColumnTypeEnum } from '../../shared/enums/column-type';
import { SVGDownloadComponent } from '../svg/download/download.component';
import { SvgCheckComponent } from '../svg/svg-check/svg-check.component';

@Component({
  selector: 'app-table-cell-template',
  standalone: true,
  imports: [
    CommonModule,
    SVGDownloadComponent,
    SvgCheckComponent,
    RouterModule,
  ],
  templateUrl: './table-cell-template.component.html',
  styleUrls: ['./table-cell-template.component.scss'],
})
export class TableCellTemplateComponent implements OnInit {
  @Input() cellType?: ColumnTypeEnum;
  @Input() cellValue: string;
  @Input() onClick?: (event: MouseEvent) => void;
  @Input() bold = false;

  protected _onClick: (event: MouseEvent) => void;

  protected hoverOverDownloadLink = false;

  ngOnInit(): void {
    if (this.onClick) {
      this._onClick = this.onClick;
    }
  }

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
