import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/']">Back to Home</a>
    <p>details works!</p>
  `,
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {}
