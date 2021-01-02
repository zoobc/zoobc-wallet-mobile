import { AbstractControl } from '@angular/forms';
import { COIN_CODE } from 'src/environments/variable.const';
import { base64ToByteArray } from './converters';

export function addressFormatValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  return (control.value && (base64ToByteArray(control.value).length !== 49
  || !control.value.startsWith(COIN_CODE) || control.value.length < 66))
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
      !control.value.address.startsWith(COIN_CODE) ||
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
  if (control.value && ( !control.value.approver || !control.value.approver.address)) {
    errors.approverAddressRequired = true;
  } else if (
    control.value &&
    control.value.approver &&
    control.value.approver.address &&
    (base64ToByteArray(control.value.approver.address).length !== 49 ||
      !control.value.approver.address.startsWith(COIN_CODE) ||
      control.value.approver.address.length < 66)
  ) {
    errors.approverAddressFormat = true;
  }

  if (control.value
    && control.value.commission !== undefined
    && control.value.commission < 0) {
    errors.commission = true;
  }

  if (control.value && !control.value.timeout) {
    errors.timeoutRequired = true;
  } else if (control.value && control.value.timeout < 1) {
    errors.timeoutMin = true;
  } else if (control.value && control.value.timeout > 750) {
    errors.timeoutMax = true;
  }

  if (Object.keys(errors).length >= 1) {
    return errors;
  } else {
    return null;
  }
}

export function objectItemValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {

  const errors: any = {};

  if (control.value && !control.value.key) {
    errors.keyRequired = true;
  } else if ( control.value && control.value.key && control.value.key.length >= 255) {
    errors.keyMax = true;
  } else if ( control.value && control.value.key && control.value.key.length <= 3 ) {
    errors.keyMin = true;
  }

  if (control.value && !control.value.value) {
    errors.valueRequired = true;
  } else if ( control.value && control.value.value && control.value.value.length >= 255) {
    errors.valueMax = true;
  } else if ( control.value && control.value.value && control.value.value.length <= 3 ) {
    errors.valueMin = true;
  }

  if (Object.keys(errors).length >= 1) {
    return errors;
  } else {
    return null;
  }
}
