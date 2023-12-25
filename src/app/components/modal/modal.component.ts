import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-com-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  protected displayModal = false;

  showModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  onBackdropClicked() {
    this.displayModal = false;
  }
}
