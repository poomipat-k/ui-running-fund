import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription, concatMap, of } from 'rxjs';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { S3Service } from '../../services/s3.service';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { S3UploadResponse } from '../../shared/models/s3-upload-response';

@Component({
  selector: 'app-website-config-footer',
  standalone: true,
  imports: [UploadButtonComponent, InputTextComponent, OnlyNumberDirective],
  templateUrl: './website-config-footer.component.html',
  styleUrl: './website-config-footer.component.scss',
})
export class WebsiteConfigFooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('uploadButton') uploadButtonComponent: UploadButtonComponent;

  @Input() footerLogoFilesSubject: BehaviorSubject<File[]>;
  @Input() form: FormGroup;

  private readonly subs: Subscription[] = [];
  private readonly s3Service: S3Service = inject(S3Service);

  // protected acceptMimes = 'image/jpg, image/jpeg, image/png, image/svg+xml';
  protected acceptMimes = 'image/*';

  get footerLogoFormArray(): FormArray {
    return this.form.get('logo') as FormArray;
  }

  get footerContact(): FormGroup {
    return this.form.get('contact') as FormGroup;
  }

  get emailControl(): FormControl {
    return this.form.get('contact.email') as FormControl;
  }

  get phoneNumberControl(): FormControl {
    return this.form.get('contact.phoneNumber') as FormControl;
  }

  get fromHourControl(): FormControl {
    return this.form.get('contact.fromHour') as FormControl;
  }

  get fromMinuteControl(): FormControl {
    return this.form.get('contact.fromMinute') as FormControl;
  }

  get toHourControl(): FormControl {
    return this.form.get('contact.toHour') as FormControl;
  }

  get toMinuteControl(): FormControl {
    return this.form.get('contact.toMinute') as FormControl;
  }

  ngAfterViewInit(): void {
    this.watchFileChangesAndUploadFormData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  getLogoFormGroup(index: number): FormGroup {
    return this.footerLogoFormArray.at(index) as FormGroup;
  }

  onDeleteLogo(index: number) {
    this.footerLogoFormArray.removeAt(index);
  }

  protected getImageFileName(objectKey: string): string {
    if (!objectKey) {
      return '';
    }
    const splits = objectKey.split('/');
    return splits[splits.length - 1];
  }

  private watchFileChangesAndUploadFormData() {
    this.subs.push(
      this.footerLogoFilesSubject
        .pipe(
          concatMap((files) => {
            if (files.length > 0) {
              const formData = new FormData();
              const name = 'footerLogo';
              const formPayload = {
                name,
                pathPrefix: 'cms/footer',
              };
              formData.append('form', JSON.stringify(formPayload));
              formData.append(name, files[0]);
              return this.s3Service.uploadFileToStaticBucket(formData);
            }
            return of(new S3UploadResponse());
          })
        )
        .subscribe({
          next: (response: S3UploadResponse) => {
            if (response.fullPath && response.objectKey) {
              this.footerLogoFormArray.push(
                new FormGroup({
                  id: new FormControl(null),
                  objectKey: new FormControl(response.objectKey),
                  linkTo: new FormControl(null),
                  fullPath: new FormControl(response.fullPath),
                })
              );
              this.uploadButtonComponent.clearFiles();
            }
          },
          error: (err) => {
            this.uploadButtonComponent.clearFiles();
          },
        })
    );
  }
}
