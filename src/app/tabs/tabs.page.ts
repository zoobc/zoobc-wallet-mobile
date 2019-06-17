import { Component, ViewChild } from '@angular/core';
import { SidemenuComponent } from 'src/components/sidemenu/sidemenu.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild(SidemenuComponent) sidemenu:SidemenuComponent;
  ionViewWillEnter() {
    this.sidemenu.getListAccounts();
  }
}
