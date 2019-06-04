import { Component } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  sender: any;
  recipient: any;
  amount: any;

  constructor(){
    this.sender = this.getAddress();
  }


  getAddress(){
    return 'Kljkhhgg989KKk';
  }


}
