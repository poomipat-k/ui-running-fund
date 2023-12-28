import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-email-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrl: './forgot-password-email-sent.component.scss',
})
export class ForgotPasswordEmailSentComponent {
  protected email: string;
  router: Router = inject(Router);

  onBack(): void {
    this.router.navigate(['/password/forgot']);
  }

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
