import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordMatchValidator(
  primary = 'password',
  secondary = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(primary);
    const confirmPasswordControl = control.get(secondary);
    if (
      passwordControl?.value &&
      passwordControl.value !== confirmPasswordControl?.value
    ) {
      return {
        confirmPasswordNotMatch: true,
      };
    }

    return null;
  };
}
