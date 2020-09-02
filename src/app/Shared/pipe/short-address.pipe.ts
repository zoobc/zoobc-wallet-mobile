import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'shortAddress'
})
export class ShortAddressPipe implements PipeTransform {
  transform(addrs: string): string {
    return addrs.substring(0, 12).concat('...').concat(addrs.substring(addrs.length - 8, addrs.length));
  }
}
