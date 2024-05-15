import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-com-privacy-policy',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  @ViewChild('modal') modal: ModalComponent;

  showModal() {
    this.modal.showModal();
  }

  closeModal() {
    this.modal.closeModal();
  }
}
