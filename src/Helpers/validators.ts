// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
