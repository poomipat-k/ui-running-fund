import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../services/housing.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  homeData: string[] = [];
  housingService: HousingService = inject(HousingService);

  constructor() {
    this.homeData = this.housingService.getData();
  }
}
