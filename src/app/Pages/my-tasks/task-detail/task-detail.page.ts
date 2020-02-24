import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async confirm() {
    const alert = await this.alertCtrl.create({
      header: 'Information',
      message: 'Feature is not available yet!',
      buttons: ['OK']
    });

    await alert.present();
  }

  async reject() {
    const alert = await this.alertCtrl.create({
      header: 'Information',
      message: 'Feature is not available yet!',
      buttons: ['OK']
    });

    await alert.present();
  }

}
