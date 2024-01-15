import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SvgCheckComponent } from '../components/svg/svg-check/svg-check.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-email-activate-success',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './email-activate-success.component.html',
  styleUrl: './email-activate-success.component.scss',
})
export class EmailActivateSuccessComponent implements OnInit {
  @Input() activateCode: string;

  protected displaySuccess = false;

  private readonly userService: UserService = inject(UserService);

  ngOnInit(): void {
    if (this.activateCode) {
      this.userService.activateUser(this.activateCode).subscribe((result) => {
        if (result > 0) {
          this.displaySuccess = true;
        }
      });
    }
  }

  router: Router = inject(Router);

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
