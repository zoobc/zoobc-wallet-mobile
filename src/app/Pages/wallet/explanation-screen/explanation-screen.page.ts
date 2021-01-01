import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-explanation-screen',
  templateUrl: './explanation-screen.page.html',
  styleUrls: ['./explanation-screen.page.scss'],
})
export class ExplanationScreenPage implements OnInit {


  constructor(private navCtrl: NavController, private platform: Platform) { }

  @ViewChild(IonSlides)
  slides: IonSlides;

  backButtonSubscription: Subscription;

  ngOnInit() {}

  next() {
    this.slides.slideNext();
  }

  finish() {
    this.navCtrl.navigateForward('/generate-passphrase');
  }
  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      const slideIndex = await this.slides.getActiveIndex();
      if (slideIndex >= 1) {
        this.slides.slidePrev();
      } else {
        this.navCtrl.pop();
      }
    });
  }

  ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
  }
}
