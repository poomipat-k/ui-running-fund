import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-com-cancel-confirm-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './cancel-confirm-modal.component.html',
  styleUrl: './cancel-confirm-modal.component.scss',
})
export class CancelConfirmModalComponent {
  @ViewChild('modal') modal: ModalComponent;

  @Input() width = '42.9rem';
  @Input() height = '30rem';
  @Input() padding = '3.4rem 5.4rem 4.6rem 5.4rem';
  @Input() text = '';

  @Output() confirmed = new EventEmitter();

  showModal() {
    this.modal.showModal();
  }

  closeModal() {
    this.modal.closeModal();
  }

  onConfirm() {
    this.confirmed.emit();
  }
}
