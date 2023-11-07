import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { mergeMap, of } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';

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
    this.userService.currentUserSubject$
      .pipe(
        mergeMap((user) => {
          if (user.id) {
            return this.projectService.getProjectDetailsForReviewer(
              user.id,
              this.projectCode
            );
          }
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('==Success result', result);
        }
      });
  }
}
