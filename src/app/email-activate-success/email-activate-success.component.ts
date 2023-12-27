import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SvgCheckComponent } from '../components/svg/svg-check/svg-check.component';

@Component({
  selector: 'app-email-activate-success',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './email-activate-success.component.html',
  styleUrl: './email-activate-success.component.scss',
})
export class EmailActivateSuccessComponent {
  router: Router = inject(Router);

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
