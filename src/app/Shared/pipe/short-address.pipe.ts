import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortAddress'
})
export class ShortAddressPipe implements PipeTransform {
  firstDigitsLength: number = 10;
  lastDigitsLength: number = 5;

  transform(value: any, args?: any): any {
    const length = value.length;
    const firstDigits = value.substr(0, this.firstDigitsLength);
    const lastDigits = value.substr(
      length - this.lastDigitsLength,
      this.lastDigitsLength
    );

    return firstDigits + '...' + lastDigits;
  }
}
