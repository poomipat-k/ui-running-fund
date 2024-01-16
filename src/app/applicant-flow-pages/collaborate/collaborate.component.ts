import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioComponent } from '../../components/radio/radio.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-collaborate',
  standalone: true,
  imports: [RadioComponent, UploadButtonComponent],
  templateUrl: './collaborate.component.html',
  styleUrl: './collaborate.component.scss',
})
export class CollaborateComponent implements OnInit {
  @Input() form: FormGroup;
  radioOptions: RadioOption[] = [
    { id: 1, value: false, display: 'ไม่มีการประสานงาน' },
    { id: 1, value: true, display: 'มีการประสานงานและมีหนังสือนำส่ง' },
  ];

  ngOnInit(): void {}
}
