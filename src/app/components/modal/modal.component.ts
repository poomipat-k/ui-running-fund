import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-com-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnDestroy {
  protected displayModal = false;

  ngOnDestroy(): void {
    this.closeModal();
  }

  showModal() {
    this.displayModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.displayModal = false;
    document.body.style.overflow = '';
  }

  onBackdropClicked() {
    this.closeModal();
  }
}
