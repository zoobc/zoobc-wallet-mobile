import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-address',
  templateUrl: './popover-address.component.html',
})
export class PopoverAddressComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() { }

  copyAddress() {
    this.popoverController.dismiss('copy');
  }

  editAddress() {
    this.popoverController.dismiss('edit');
  }

  deleteAddress() {
    this.popoverController.dismiss('delete');
  }

}
