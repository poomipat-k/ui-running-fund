import { ColumnTypeEnum } from '../enums/column-type';

export class TableColumn {
  name!: string;
  class?: string;
  type?: ColumnTypeEnum;

  constructor() {}
}
