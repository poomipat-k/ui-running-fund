import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, catchError, throwError } from 'rxjs';
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
  animations: [
    trigger('animationPos', [
      state(
        'from',
        style({
          top: '{{fromY}}',
        }),
        { params: { fromY: '0px' } } // parameter passed in the template
      ),
      state(
        'to',
        style({
          top: '{{toY}}',
        }),
        { params: { toY: '0px' } } // parameter passed in the template
      ),

      transition('from => to', [animate('{{time}}')]),
      transition('to => from', [animate('{{time}}')]),
    ]),
  ],
})
export class CaptchaComponent implements OnDestroy {
  @ViewChild('captchaModal') captchaModal: ModalComponent;

  @Input() disabled = false;
  @Input() animationDuration = '300ms';

  @Output() captchaSubmitEmit = new EventEmitter<CaptchaSubmitEmit>();
  @Output() captchaModalCloseEvent = new EventEmitter();

  protected readonly MIN_X_POSITION = 5;
  protected readonly MAX_X_POSITION = 245;

  protected captchaPuzzle: CaptchaPuzzle = new CaptchaPuzzle();

  protected puzzleYPosition = '0px';
  protected currentXValue = this.MIN_X_POSITION;
  protected internalDisabled = false;

  protected animationPos = 'from';
  protected fromPos = '0px';
  protected toPos = '0px';

  private captchaService: CaptchaService = inject(CaptchaService);

  private readonly subs: Subscription[] = [];

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  resetSliderBar() {
    this.currentXValue = this.MIN_X_POSITION;
  }

  onCaptchaModalClosed() {
    this.resetSliderBar();
    this.captchaModalCloseEvent.emit();

    this.subs.forEach((s) => s.unsubscribe());
    this.internalDisabled = false;
  }

  refreshCaptcha() {
    this.generateCaptcha();
  }

  openCaptchaModal() {
    // Clean previous state
    this.captchaPuzzle = new CaptchaPuzzle();
    this.puzzleYPosition = '0px';

    this.generateCaptcha();
    this.captchaModal.showModal();
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
    this.internalDisabled = true;
    this.subs.push(
      this.captchaService
        .generateCaptcha()
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.internalDisabled = false;
            return throwError(() => err);
          })
        )
        .subscribe((captchaPuzzle) => {
          if (captchaPuzzle) {
            if (this.animationPos === 'from') {
              this.fromPos = `${this.captchaPuzzle.yPosition || 0}px`;
              this.toPos = `${captchaPuzzle.yPosition || 0}px`;
              this.animationPos = 'to';
            } else if (this.animationPos === 'to') {
              this.fromPos = `${captchaPuzzle.yPosition || 0}px`;
              this.toPos = `${this.captchaPuzzle.yPosition || 0}px`;
              this.animationPos = 'from';
            }
            this.captchaPuzzle = captchaPuzzle;
            this.puzzleYPosition = captchaPuzzle.yPosition + 'px';
          }
          this.internalDisabled = false;
        })
    );
  }
}
