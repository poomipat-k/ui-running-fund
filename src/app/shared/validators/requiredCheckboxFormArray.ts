import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function requiredCheckBoxFormArrayToBeCheckedValidator(
  minRequired = 1
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let checked = 0;
    (control as FormArray).controls?.forEach((c) => {
      if (c.value.checked === true) {
        checked++;
      }
    });
    if (checked < minRequired) {
      return {
        requiredCheckBoxFormArrayToBeChecked: true,
      };
    }
    return null;
  };
}
