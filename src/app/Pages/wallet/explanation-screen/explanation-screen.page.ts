import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-explanation-screen',
  templateUrl: './explanation-screen.page.html',
  styleUrls: ['./explanation-screen.page.scss'],
})
export class ExplanationScreenPage implements OnInit {

 
  constructor(private navCtrl: NavController, private platform: Platform) { }

  @ViewChild(IonSlides)
  slides: IonSlides
  
  ngOnInit() {}

  next(){
    this.slides.slideNext()
  }

  finish(){
    this.navCtrl.navigateForward("/generate-passphrase");
  }

  backButtonSubscription;
  ionViewDidEnter(){
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      const slideIndex = await this.slides.getActiveIndex();
      if(slideIndex>=1){
        this.slides.slidePrev();
      }else{
        this.navCtrl.pop();
      }
    })
  }

  ionViewWillLeave(){
    this.backButtonSubscription.unsubscribe()
  }
}
