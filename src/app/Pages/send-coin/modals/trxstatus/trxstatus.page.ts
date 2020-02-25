import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trxstatus',
  templateUrl: './trxstatus.page.html',
  styleUrls: ['./trxstatus.page.scss'],
})
export class TrxstatusPage implements OnInit {
  status = true;
  msg = '';

  constructor(private modalController: ModalController, private navParams: NavParams, private router: Router) { }

  ngOnInit() {
    this.status = this.navParams.data.status;
    this.msg = this.navParams.data.msg;
  }

  async close() {
    if (this.status) {
      this.router.navigateByUrl('/transactions');
    }
    this.modalController.dismiss(); // close modal
    // console.log('============= status closed --- ');
  }


  async newTrx() {
    this.router.navigateByUrl('/sendcoin');
    this.modalController.dismiss(); // close modal
    // console.log('============= status transaction new ');
  }

}
