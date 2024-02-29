import { Distances } from './distances';
import { ReviewDetails } from './review-details';
import { ReviewerImprovement } from './review-improvement';

export class ReviewerProjectDetails {
  projectId: number;
  projectHistoryId: number;
  projectCode: string;
  projectCreatedAt: string;
  projectName: string;
  projectHeadPrefix: string;
  projectHeadFirstName: string;
  projectHeadLastName: string;
  fromDate: string;
  toDate: string;
  address: string;
  provinceName: string;
  districtName: string;
  subdistrictName: string;
  distances: Distances[];
  expectedParticipants: string;
  collaborated: boolean;
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
