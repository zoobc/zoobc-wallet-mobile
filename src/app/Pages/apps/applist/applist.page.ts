import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-applist',
  templateUrl: './applist.page.html',
  styleUrls: ['./applist.page.scss'],
})
export class ApplistPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  showSellApp() {
    this.router.navigateByUrl('/sell-coin');
  }

  async showListOtherApp() {
    const alert = await this.alertCtrl.create({
      header: 'Coming Soon!',
      message: 'Feature will available soon',
      buttons: ['Close']
    });
    await alert.present();
  }

}
