import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CaptchaService } from '../../services/captcha.service';
import { CaptchaPuzzle } from '../../shared/models/captcha-puzzle';
import { CaptchaSubmitEmit } from '../../shared/models/captcha-submit-event';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-com-captcha',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
})
export class CaptchaComponent implements OnDestroy {
  @ViewChild('captchaModal') captchaModal: ModalComponent;

  @Output() captchaSubmitEmit = new EventEmitter<CaptchaSubmitEmit>();

  protected readonly MIN_X_POSITION = 5;
  protected readonly MAX_X_POSITION = 243;

  protected captchaPuzzle: CaptchaPuzzle = new CaptchaPuzzle();

  protected puzzleYPosition = '0px';
  protected currentXValue = this.MIN_X_POSITION;

  private captchaService: CaptchaService = inject(CaptchaService);

  private readonly subs: Subscription[] = [];

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  resetSliderBar() {
    this.currentXValue = this.MIN_X_POSITION;
  }

  refreshCaptcha() {
    this.generateCaptcha();
  }

  openCaptchaModal() {
    this.generateCaptcha();
  }

  onCloseCaptcha() {
    this.captchaModal.closeModal();
  }

  onSliderInput(e: any) {
    // While holding slider thumb
    this.currentXValue = e.target?.valueAsNumber;
  }

  onSliderChanged(e: any) {
    // Drop the thumb
    const value: number = e.target?.valueAsNumber || 0;
    if (!value) {
      return;
    }
    // EMIT event captchaId and captchaValue
    const captchaPayload = new CaptchaSubmitEmit();
    captchaPayload.captchaId = this.captchaPuzzle.captchaId;
    captchaPayload.captchaValue = value;
    this.captchaSubmitEmit.emit(captchaPayload);
  }

  private generateCaptcha() {
    this.resetSliderBar();
    this.subs.push(
      this.captchaService.generateCaptcha().subscribe((captchaPuzzle) => {
        if (captchaPuzzle) {
          this.captchaPuzzle = captchaPuzzle;
          this.puzzleYPosition = captchaPuzzle.yPosition + 'px';
          this.captchaModal.showModal();
        }
      })
    );
  }
}
