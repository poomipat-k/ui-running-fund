import { ReviewDetails } from './review-details';

export class ReviewerProjectDetails {
  projectId: number;
  projectCode: string;
  projectCreatedAt: string;
  projectName: string;
  reviewerId?: number;
  reviewedAt?: string;
  isInterestedPerson?: boolean;
  interestedPesonType?: string;
  reviewDetails?: ReviewDetails[];
  constructor() {}
}
