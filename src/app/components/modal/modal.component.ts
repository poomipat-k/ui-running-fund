import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
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
  @Input() customContainer = {};

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
  }

  onBackdropClicked() {
    this.closeModal();
  }

  onKeyUp(event: any) {
    if (event?.keyCode === 27) {
      this.closeModal();
    }
  }
}
