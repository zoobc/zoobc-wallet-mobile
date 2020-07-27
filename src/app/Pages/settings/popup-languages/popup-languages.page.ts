import { Component, OnInit } from '@angular/core';
import { LANGUAGES } from 'src/environments/variable.const';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-popup-languages',
  templateUrl: './popup-languages.page.html',
  styleUrls: ['./popup-languages.page.scss'],
})
export class PopupLanguagesPage implements OnInit {

  public languages = LANGUAGES;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async languageClicked(code: string) {
    await this.modalController.dismiss(code);
  }

  async close() {
    await this.modalController.dismiss();
  }

}
