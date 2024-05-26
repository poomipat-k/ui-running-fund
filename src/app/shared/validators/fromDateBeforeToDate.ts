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

    if (!isValidDate(val.fromYear, val.fromMonth, val.fromDay)) {
      return {
        invalidFromDate: true,
      };
    }
    if (!isValidDate(val.toYear, val.toMonth, val.toDay)) {
      return {
        invalidToDate: true,
      };
    }

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

function isValidDate(year: number, month: number, day: number): boolean {
  if (!year || !month || !day) {
    return false;
  }
  if (month > 12 || day > 31) {
    return false;
  }
  return new Date(year, month - 1, day).getDate() === day;
}
