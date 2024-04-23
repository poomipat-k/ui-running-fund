import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function fromDateBeforeToDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let touchedCount = 0;
    const controls = Object.keys((control as FormGroup)?.controls);
    controls?.forEach((key) => {
      const c = control.get(key);
      if (c?.value) {
        touchedCount++;
      }
    });
    if (touchedCount !== controls.length) {
      return {
        notAllFieldsHaveValue: true,
      };
    }
    const val = (control as FormGroup).value;

    const fromDate = new Date(val.fromYear, val.fromMonth - 1, val.fromDay);
    const toDate = new Date(val.toYear, val.toMonth - 1, val.toDay);
    if (fromDate > toDate) {
      return {
        fromDateLaterThanToDate: true,
      };
    }
    return null;
  };
}
