import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-com-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnDestroy {
  @ViewChild('modal') modal: ElementRef;

  @Input() width = '';
  @Input() height = '';
  @Input() padding = '';

  @Output() modalCloseEvent = new EventEmitter();

  protected displayModal = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.closeModal();
  }

  showModal() {
    this.displayModal = true;
    this.changeDetectorRef.detectChanges();

    document.body.style.overflow = 'hidden';
    this.modal.nativeElement.focus();
  }

  closeModal() {
    this.displayModal = false;
    document.body.style.overflow = '';
    this.modalCloseEvent.emit();
  }

  onBackdropClicked() {
    this.closeModal();
  }

  onKeyUp(event: any) {
    // when esc key pressed
    if (event?.keyCode === 27) {
      this.closeModal();
    }
  }
}
