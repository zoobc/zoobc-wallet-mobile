import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {

  constructor(private alertCtrl: AlertController, private alertController: AlertController) {}
  ngOnInit() {
  }


  async showTaskDetail() {
    const alert = await this.alertCtrl.create({
      header: 'Coming Soon!',
      message: 'Feature will available soon',
      buttons: ['Close']
    });
    await alert.present();
  }

}
