import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-radio-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio-item.component.html',
  styleUrl: './radio-item.component.scss',
})
export class RadioItemComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() name = '';
  @Input() controlName = '';
  @Input() value: any;
  @Input() display: any;
  @Input() disabled = false;
  @Input() fontSize = '18px';
  @Input() gap = '0px';
  @Input() onChanged: () => void;

  ngOnInit(): void {
    if (this.onChanged) {
      this._onChanged = this.onChanged;
    }
  }

  _onChanged() {}
}
