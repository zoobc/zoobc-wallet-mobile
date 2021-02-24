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

import { FormArray, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  base64ToByteArray,
  fromBase64Url,
} from './converters';


export function getTranslation(
  value: string,
  translateService: TranslateService,
  // tslint:disable-next-line:ban-types
  interpolateParams?: Object
) {
  let message: string;
  translateService.get(value, interpolateParams).subscribe(res => {
    message = res;
  });
  return message;
}


export function stringToBuffer(str: string) {
  return Buffer.from(str, 'base64');
}
export function uniqueParticipant(formArray: FormArray): ValidationErrors {
  const values = formArray.value.filter((val: string | any[]) => val.length > 0);
  const controls = formArray.controls;
  const result = values.some((element: any, index: any) => {
    return values.indexOf(element) !== index;
  });
  const invalidControls = controls.filter(ctrl => ctrl.valid === false);
  if (result && invalidControls.length === 0) {
    return { duplicate: true };
  }
  return null;
}

export function base64ToHex(str: string) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toUpperCase();
}


export function onCopyText(text: string) {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function addressValidation(address: string) {
  const addressBase64 = fromBase64Url(address);
  const addressBytes = base64ToByteArray(addressBase64);
  if (addressBytes.length === 33 && addressBase64.length === 44) {
    return true;
  } else { return false; }
}

export function getFileName(prefix: string) {
  const currentDatetime = new Date();
  const formattedDate =
    currentDatetime.getDate() +
    '-' +
    (currentDatetime.getMonth() + 1) +
    '-' +
    currentDatetime.getFullYear() +
    '-' +
    currentDatetime.getHours() +
    '-' +
    currentDatetime.getMinutes() +
    '-' +
    currentDatetime.getSeconds();

  return prefix + '_' + formattedDate + '.json';
}


export function isPubKeyValid(pubkey: string) {
  const addressBytes = base64ToByteArray(pubkey);
  if (addressBytes.length === 32 && pubkey.length === 44) {
    return true;
  } else { return false; }
}

export function truncate(num: number, places: number): number {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

export function jsonBufferToString(buf: any) {
  if (!buf) { return ''; }
  try {
    return Buffer.from(buf.data, 'base64').toString('base64');
  } catch (error) {
    return buf.toString('base64');
  }
}


