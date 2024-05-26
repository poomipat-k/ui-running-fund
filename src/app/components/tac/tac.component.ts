import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-com-tac',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './tac.component.html',
  styleUrl: './tac.component.scss',
})
export class TacComponent {
  @ViewChild('modal') modal: ModalComponent;

  showModal() {
    this.modal.showModal();
  }

  closeModal() {
    this.modal.closeModal();
  }
}
