import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  showTasks(){
    this.presentAlert();
  }

  showTasksMultisig() {
    this.presentAlert();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Coming soon',
      //  subHeader: 'Coming soon',
      message: 'This feature not available yet.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
