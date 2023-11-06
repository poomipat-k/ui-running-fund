import { ColumnTypeEnum } from '../enums/column-type';

export class TableColumn {
  name!: string;
  format?: string;
  class?: string;
  type?: ColumnTypeEnum;
  bold?: boolean;
  compact?: boolean;

  constructor() {}
}
