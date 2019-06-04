import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestapiService } from '../../services/restapi.service';
import * as  SHA256 from 'crypto-js/sha256'; 

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {
  sender: any;
  recipient: any;
  amount: any;
  fee: any;
  result: any;
  dataui: any;
  status: any;

  constructor( private loadingController: LoadingController, private apiservice: RestapiService){
    this.sender = this.getAddress();
    this.resetForm();
  }

  ngOnInit() {

  }

  resetForm(){
    this.recipient = this.getFakeRecipient();
    this.amount = Math.floor((Math.random() * 10000) + 1);
    this.fee =  Math.floor((Math.random() * 10) + 1);
  }

  getFakeRecipient(){
    const recipient = Math.floor((Math.random() * 1000000) + 1) + '-Recipient';
    return SHA256(JSON.stringify(recipient)).toString();
  }

  async sendMoney() {
    this.status = '... processing ...';
    this.recipient = this.getFakeRecipient();

    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.apiservice.sendMoney(this.sender, this.recipient, this.amount, this.fee)
      .subscribe(res => {
        console.log(res);
        this.result = res[0];
        this.dataui = this.result['data'];
        this.status = '... success ...';
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.status = '... error ...';
      });

    this.resetForm();

  }


  getAddress() {
    const sender = Math.floor((Math.random() * 1000000) + 1) + '-Sender';
    return SHA256(JSON.stringify(sender)).toString();
  }


}
