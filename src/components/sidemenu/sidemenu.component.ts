import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  constructor(
    private menuController: MenuController,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.getListAccounts()
  }

  ngOnChanges() {
    console.log("item changes")
  }

  openMenu() {
    this.menuController.open("first")
  }

  goToGenerate() {
    this.router.navigate(['/generate-passphrase'])
  }

  async getListAccounts() {
    const accounts = await this.storage.get('encrypted_key')
    console.log("accounts", accounts)
  }

}
