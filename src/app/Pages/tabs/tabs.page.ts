import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {

  @ViewChild('homeTabs') homeTabs: IonTabs;

  public activeTab: any;

  constructor() { }

  ngOnInit() { }

  tabChanged(): void {
    this.activeTab = this.homeTabs.getSelected();
  }

}
