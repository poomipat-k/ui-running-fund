import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements OnInit {
  // Form version
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() controlName: string;
  @Input() display: string;
  @Input() disabled = false;
  @Input() onChanged: () => void;
  @Input() innerHTML: string;
  // View version
  @Input() value: any;
  @Input() name: string;
  @Input() checked = false;
  // Other config
  @Input() fontSize = '2rem'; // small
  @Input() gap = '1.4rem';

  ngOnInit(): void {
    if (this.onChanged) {
      this._onChanged = this.onChanged;
    }
  }

  _onChanged() {}
}
