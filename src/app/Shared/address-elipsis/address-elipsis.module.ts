import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddressElipsisDirective } from "./address-elipsis.directive";

@NgModule({
  declarations: [AddressElipsisDirective],
  imports: [CommonModule],
  exports: [AddressElipsisDirective]
})
export class AddressElipsisModule {}
