import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-email-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrl: './forgot-password-email-sent.component.scss',
})
export class ForgotPasswordEmailSentComponent implements OnInit {
  protected email: string;
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const email = params['email'];
      this.email = email;
    });
  }

  onBack(): void {
    this.router.navigate(['/password/forgot']);
  }

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
