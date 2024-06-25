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
import { CustomEditorComponent } from '../../components/custom-editor/custom-editor.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { S3Service } from '../../services/s3.service';
import { S3UploadResponse } from '../../shared/models/s3-upload-response';

@Component({
  selector: 'app-website-config-landing-page',
  standalone: true,
  imports: [UploadButtonComponent, InputTextComponent, CustomEditorComponent],
  providers: [],
  templateUrl: './website-config-landing-page.component.html',
  styleUrl: './website-config-landing-page.component.scss',
})
export class WebsiteConfigLandingPageComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('uploadButton') uploadButtonComponent: UploadButtonComponent;

  @Input() bannerFilesSubject: BehaviorSubject<File[]>;
  @Input() form: FormGroup;

  private readonly subs: Subscription[] = [];

  private readonly s3Service: S3Service = inject(S3Service);

  protected editorImageUploadPrefix = 'cms/landing';

  get dataGroup(): FormGroup {
    return this.form.get('data') as FormGroup;
  }

  get bannerFormArray(): FormArray {
    return this.form.get('banner') as FormArray;
  }

  get contentControl(): FormControl {
    return this.form.get('content') as FormControl;
  }

  get selectedFiles() {
    return this.uploadButtonComponent?.files || [];
  }

  ngAfterViewInit(): void {
    this.watchFileChangesAndUploadFormData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  getBannerFormGroup(index: number): FormGroup {
    return this.bannerFormArray.at(index) as FormGroup;
  }

  private watchFileChangesAndUploadFormData() {
    this.subs.push(
      this.bannerFilesSubject
        .pipe(
          concatMap((files) => {
            if (files.length > 0) {
              const formData = new FormData();
              const formPayload = {
                name: 'banner',
                pathPrefix: 'cms/landing_banner',
              };
              formData.append('form', JSON.stringify(formPayload));
              formData.append('banner', files[0]);
              return this.s3Service.uploadFileToStaticBucket(formData);
            }
            return of(new S3UploadResponse());
          })
        )
        .subscribe((response: S3UploadResponse) => {
          if (response.fullPath && response.objectKey) {
            this.bannerFormArray.push(
              new FormGroup({
                id: new FormControl(null),
                objectKey: new FormControl(response.objectKey),
                linkTo: new FormControl(null),
                fullPath: new FormControl(response.fullPath),
              })
            );
            this.uploadButtonComponent.clearFiles();
          }
        })
    );
  }

  protected getImageFileName(objectKey: string): string {
    if (!objectKey) {
      return '';
    }
    const splits = objectKey.split('/');
    return splits[splits.length - 1];
  }

  onDeleteBanner(index: number) {
    this.bannerFormArray.removeAt(index);
  }
}
