import { AbstractControl } from '@angular/forms';
import { base64ToByteArray } from './converters';

export function addressFormatValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  return (control.value && (base64ToByteArray(control.value).length !== 49 || !control.value.startsWith("ZBC") || control.value.length < 66))
    ? { addressFormat: true }
    : null;
}