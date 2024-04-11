export class AdminDashboardSummaryData {
  projectCount: number;
  approvedProjectCount: number;
  approvedFundSum: number;
  averageFund: number;

  constructor() {
    this.projectCount = 0;
    this.approvedProjectCount = 0;
    this.approvedFundSum = 0;
    this.averageFund = 0;
  }
}
