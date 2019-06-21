import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { RestapiService } from '../../../services/restapi.service';
import { AuthService } from 'src/services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { GRPCService } from 'src/services/grpc.service';
@Component({
  selector: 'app-tab-dashboard',
  templateUrl: 'tab-dashboard.page.html',
  styleUrls: ['tab-dashboard.page.scss']
})
export class TabDashboardPage implements OnInit {

  data1: any;
  data2: any;
  balance: any;
  transactions: any;
  publicKey = 'JkhkUiury9899';

  constructor(
    private apiservice: RestapiService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private navCtrl: NavController,
    private grpcService: GRPCService
  ) { }

  goToSend() {
    this.router.navigateByUrl("tabs/send")
  }

  goToRequest() {
    this.router.navigateByUrl("tabs/receive")
  }

  async getBalance(pKey: string) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.apiservice.getBalance(pKey)
      .subscribe(res => {
        console.log(res);
        this.data1 = res[0];
        this.balance = this.data1['data'];
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async getTransaction(pKey: string) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.apiservice.getAccountTransactions(pKey)
      .subscribe(res => {
        console.log(res);
        this.data2 = res[0];
        this.transactions = this.data2['transactions'];
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  logout() {
    console.log("test logout")
    this.authService.logout();
    this.router.navigate(['login']);
  }

  ngOnInit() {
    // this.getBalance(this.publicKey);
    // this.getTransaction(this.publicKey);
    this.getAccountBalance()
    this.getAccountTransaction()
  }

  async getAccountBalance() {
    this.balance = await this.grpcService.getAccountBalance()
  }

  async getAccountTransaction() {
    this.transactions  = await this.grpcService.getAccountTransaction()
    console.log("transactions", this.transactions)
    this.getBalance(this.publicKey);
    this.getTransaction(this.publicKey);


  }

}
