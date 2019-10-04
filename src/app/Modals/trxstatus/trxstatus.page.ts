import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-trxstatus',
  templateUrl: './trxstatus.page.html',
  styleUrls: ['./trxstatus.page.scss'],
})
export class TrxstatusPage implements OnInit {
  status = true;
  msg = '';

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.status = this.navParams.data.status;
    this.msg = this.navParams.data.msg;
  }

  async close() {
    await this.modalController.dismiss(0);
  }

}
