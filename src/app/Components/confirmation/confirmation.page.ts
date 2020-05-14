import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  public status: boolean;
  public msg: string;
  public title: string;

  constructor(private modalController: ModalController, private navParams: NavParams, private router: Router) { }

  ngOnInit() {
    this.title = this.navParams.data.title;
    this.status = this.navParams.data.status;
    this.msg = this.navParams.data.msg;
  }

  async close() {
    this.modalController.dismiss();
  }

}
