import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaqComponent } from '../components/faq/faq.component';

@Component({
  selector: 'app-asking-for-help',
  standalone: true,
  imports: [RouterModule, FaqComponent],
  templateUrl: './asking-for-help.component.html',
  styleUrl: './asking-for-help.component.scss',
})
export class AskingForHelpComponent {}
