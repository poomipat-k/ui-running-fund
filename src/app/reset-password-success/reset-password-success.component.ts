import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-password-success.component.html',
  styleUrl: './reset-password-success.component.scss',
})
export class ResetPasswordSuccessComponent {
  router: Router = inject(Router);

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
