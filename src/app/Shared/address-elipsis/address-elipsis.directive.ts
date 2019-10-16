import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[appAddressElipsis]"
})
export class AddressElipsisDirective {
  constructor(private el: ElementRef<any>) {}

  private leftStrLength: number = 10;

  private rightStrLength: number = 10;

  @Input() set address(address: string) {
    if (address) {
      let value = address;

      if (address.length > this.leftStrLength + this.rightStrLength) {
        const firstString = address.substring(0, this.leftStrLength);

        const lastString = address.substr(address.length - this.rightStrLength);

        value = firstString + "..." + lastString;
      }

      this.el.nativeElement.innerHTML = "<span>" + value + "</span>";
    }
  }
}
