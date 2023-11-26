import { ReviewDetails } from './review-details';
import { ReviewerImprovement } from './review-improvement';

export class ReviewerProjectDetails {
  projectId: number;
  projectHistoryId: number;
  projectCode: string;
  projectCreatedAt: string;
  projectName: string;
  reviewId?: number;
  reviewedAt?: string;
  isInterestedPerson?: boolean;
  interestedPersonType?: string;
  reviewDetails?: ReviewDetails[];
  reviewSummary?: string;
  reviewerComment?: string;
  reviewImprovement?: ReviewerImprovement;

  constructor() {}
}
