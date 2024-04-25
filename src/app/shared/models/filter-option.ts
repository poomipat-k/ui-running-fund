export class FilterOption {
  id: number;
  display: string;
  name: string;
  isAsc: boolean;
  dbSortBy?: string[];

  constructor() {}
}
