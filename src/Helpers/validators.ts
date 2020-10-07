import { AbstractControl } from '@angular/forms';
import { base64ToByteArray } from './converters';

export function addressFormatValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  return (control.value && (base64ToByteArray(control.value).length !== 49 || !control.value.startsWith("ZBC") || control.value.length < 66))
    ? { addressFormat: true }
    : null;
}

export function addressValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value &&
    control.value.address &&
    (base64ToByteArray(control.value.address).length !== 49 ||
      !control.value.address.startsWith('ZBC') ||
      control.value.address.length < 66)
  ) {
    return { addressFormat: true };
  } else if (control.value && !control.value.address) {
    return { addressRequired: true };
  } else {
    return null;
  }
}

export function escrowFieldsValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const errors: any = {};

  if (
    control.value &&
    control.value.approver &&
    control.value.approver.address &&
    (base64ToByteArray(control.value.approver.address).length !== 49 ||
      !control.value.approver.address.startsWith('ZBC') ||
      control.value.approver.address.length < 66)
  ) {
    errors.approverAddressFormat = true;
  } else if (
    control.value &&
    control.value.approver &&
    !control.value.approver.address
  ) {
    errors.approverAddressRequired = true;
  }

  if (control.value && !control.value.commission) {
    errors.commissionRequired = true;
  } else if (control.value && control.value.commission < 0.00000001) {
    errors.commissionMin = true;
  }

  if (control.value && !control.value.timeout) {
    errors.timeoutRequired = true;
  } else if (control.value && control.value.timeout < 1) {
    errors.timeoutMin = true;
  } else if (control.value && control.value.timeout > 750) {
    errors.timeoutMax = true;
  }

  if (control.value && !control.value.instruction) {
    errors.instruction = true;
  }

  if (Object.keys(errors).length >= 1) {
    return errors;
  } else {
    return null;
  }
}
