import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'shortAddress'
})
export class ShortAddressPipe implements PipeTransform {
  transform(addrs: string): string {
    return addrs.substring(0, 8).concat('...').concat(addrs.substring(addrs.length - 4, addrs.length));
  }
}
