import { Component, ViewChild } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { IonTabs } from "@ionic/angular";
import { SidemenuComponent } from "src/app/Shared/sidemenu/sidemenu.component";

@Component({
  selector: "app-main",
  templateUrl: "main.page.html",
  styleUrls: ["main.page.scss"]
})
export class MainPage {
  @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent;

  @ViewChild("myTabs") tabRef: IonTabs;

  seeTabs = true;

  onTabChanged($event) {
    if ($event.tab === "dashboard") {
      this.seeTabs = false;
    } else {
      this.seeTabs = true;
    }
  }

  constructor(private router: Router) {}
}
