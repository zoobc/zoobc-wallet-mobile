import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss']
})
export class SetupPinPage implements OnInit {
  private tempPin: string;
  public pagePosition: number;
  public passphrase: string;
  public processing = false;
  public loginFail = false;
  public theme = DEFAULT_THEME;

  constructor(
    private modalCtrl: ModalController,
    private themeSrv: ThemeService
  ) {

    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });

  }

  ngOnInit() {
    this.pagePosition = 0;
    this.processing = false;
    this.tempPin = '';
    this.theme = this.themeSrv.theme;
  }

  setupPin(event: any) {
    // console.log('====event:', event);
    this.loginFail = false;
    this.tempPin = event.pin;
    this.processing = true;
    setTimeout(() => {
      this.pagePosition++;
      this.processing = false;
    }, 1500);
  }

  async confirmPin(event: any) {
    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // console.log('====pin:', pin);
    if (this.tempPin === pin) {
      // console.log('==== key existing: ', pin);
      this.modalCtrl.dismiss(pin);
      setTimeout(() => {
        this.processing = false;
      }, 5000);
    } else {
      this.loginFail = true;
      setTimeout(() => {
        this.loginFail = false;
        this.processing = false;
      }, 1500);
    }
  }

  async cancel() {
    await this.modalCtrl.dismiss('-');
  }

}
