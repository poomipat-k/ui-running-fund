import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../components/button/button/button.component';
import { FaqComponent } from '../components/faq/faq.component';
import { InputTextComponent } from '../components/input-text/input-text.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { TextareaComponent } from '../components/textarea/textarea.component';
import { ContactUsService } from '../services/contact-us.service';
import { WebsiteConfigService } from '../services/website-config.service';
import { AccordionItem } from '../shared/models/accordion-item';

@Component({
  selector: 'app-asking-for-help',
  standalone: true,
  imports: [
    RouterModule,
    FaqComponent,
    InputTextComponent,
    TextareaComponent,
    ButtonComponent,
    SuccessPopupComponent,
    CommonModule,
  ],
  templateUrl: './asking-for-help.component.html',
  styleUrl: './asking-for-help.component.scss',
})
export class AskingForHelpComponent implements OnInit, OnDestroy {
  protected form: FormGroup;
  protected formTouched = false;
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly contactUsService: ContactUsService =
    inject(ContactUsService);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  protected enableScroll = true;

  protected showSuccessPopup = false;
  protected successPopupText = 'ส่งข้อความขอความช่วยเหลือสำเร็จ';

  protected faqList: AccordionItem[] = [];

  subs: Subscription[] = [];

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });

    this.getFaq();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onSubmitClick() {
    if (!this.formTouched) {
      this.formTouched = true;
    }

    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return;
    }
    this.subs.push(
      this.contactUsService
        .sendContactUsRequest(this.form.value)
        .subscribe((result) => {
          if (result?.success) {
            this.successPopupText = 'อัพเดตข้อมูลเว็บไซต์เรียบร้อยแล้ว';
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.form.reset();
              this.showSuccessPopup = false;
            }, 2000);
          }
        })
    );
  }

  private isFormValid(): boolean {
    return this.form.valid ?? false;
  }

  private markFieldsTouched() {
    this.form.markAllAsTouched();

    const errorId = this.getFirstErrorIdWithPrefix(this.form, '');
    console.error('errorId:', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 120]);
    this.scroller.scrollToAnchor(id);
  }

  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  private getFaq() {
    this.subs.push(
      this.websiteConfigService.getFAQ().subscribe((faqList) => {
        if (faqList) {
          this.faqList = faqList?.map((faq) => ({
            header: faq.question,
            content: faq.answer,
          }));
        }
      })
    );
  }
}
