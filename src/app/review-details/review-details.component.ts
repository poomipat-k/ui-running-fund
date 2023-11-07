import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-review-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss'],
})
export class ReviewDetailsComponent implements OnInit {
  // url params
  @Input() projectCode: string;

  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    // const user = this.userService.getCurrentUser();
    this.userService.currentUserSubject.subscribe((user) => {
      console.log('==user', user);
      if (user.id) {
        this.projectService
          .getProjectDetailsForReviewer(user.id, this.projectCode)
          .subscribe((result) => {
            console.log('===result', result);
          });
      }
    });
    // this.projectService.getProjectDetailsForReviewer(4, this.projectCode);
  }
}
