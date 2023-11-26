import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function requiredCheckBoxToBeCheckedValidator(
  minRequired = 1
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let checked = 0;
    Object.keys((control as FormGroup)?.controls)?.forEach((key) => {
      const c = control.get(key);
      if (c?.value === true) {
        checked++;
      }
    });
    if (checked < minRequired) {
      return {
        requiredCheckBoxToBeChecked: true,
      };
    }
    return null;
  };
}
