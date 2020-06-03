import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-msig-add-signature',
  templateUrl: './msig-add-signature.page.html',
  styleUrls: ['./msig-add-signature.page.scss'],
})
export class MsigAddSignaturePage implements OnInit {


  public numberOfParticipant: number;

  constructor() {
      this.numberOfParticipant = 3;
   }

  ngOnInit() {

  }

  addParticipant() {

  }

}
