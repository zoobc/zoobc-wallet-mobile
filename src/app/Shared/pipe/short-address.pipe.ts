import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'shortAddress'
})
export class ShortAddressPipe implements PipeTransform {
  defaultFirstDigitsLength: number = 8;
  defaultLastDigitsLength: number = 4;

  transform(value: string, firstDigitsLength?: number, lastDigitsLength?:number): any {

    const length = value.length;

    const _firstDigitsLength = firstDigitsLength?firstDigitsLength:this.defaultFirstDigitsLength;
    const _lastDigitsLength = lastDigitsLength?lastDigitsLength: this.defaultLastDigitsLength;

    const firstDigits = value.substr(0, _firstDigitsLength);
    const lastDigits = value.substr(length - _lastDigitsLength, _lastDigitsLength);
    
    return firstDigits + '...' + lastDigits;
  }
}
