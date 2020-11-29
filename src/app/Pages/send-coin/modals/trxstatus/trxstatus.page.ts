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
  message = '';

  constructor(private modalController: ModalController, private navParams: NavParams, private router: Router) { }

  ngOnInit() {
  }

  async close() {
    this.modalController.dismiss();
    if (this.status) {
      this.router.navigateByUrl('/dashboard');
    }
   }

  async newTrx() {
    this.modalController.dismiss();
  }

}
