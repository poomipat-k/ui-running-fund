import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup-success.component.html',
  styleUrl: './signup-success.component.scss',
})
export class SignupSuccessComponent implements OnInit {
  protected email: string;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.route.queryParams.subscribe((params) => {
        this.email = params?.['email'];
      })
    );
  }

  onBack(): void {
    this.router.navigate(['/signup']);
  }

  onOk(): void {
    this.router.navigate(['/login']);
  }
}
