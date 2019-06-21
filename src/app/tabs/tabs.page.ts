import { Component, ViewChild } from '@angular/core';
import { SidemenuComponent } from 'src/components/sidemenu/sidemenu.component';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';

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


  @ViewChild('myTabs') tabRef: IonTabs;

  seeTabs = true;

  onTabChanged($event) {
    if ($event.tab === 'dashboard') {
      this.seeTabs = false
    } else {
      this.seeTabs = true
    }
  }

  constructor(private router: Router) { }
}
