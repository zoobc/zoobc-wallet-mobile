import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  constructor() { }

  stringToArrayByte(str) {
    str = unescape(encodeURIComponent(str)); // temporary

    const bytes = new Array(str.length);
    for (let i = 0; i < str.length; ++i) {
      bytes[i] = str.charCodeAt(i);
    }

    return Uint8Array.from(bytes);
  }

  hexToArrayByte(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }
}
