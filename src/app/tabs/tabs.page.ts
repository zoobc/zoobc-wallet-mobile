import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


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
