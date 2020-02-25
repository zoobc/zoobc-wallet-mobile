import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
  }

  goBackupRestore() {
    this.router.navigateByUrl('/backuprestore-address');
    this.menuController.close('mainMenu');
  }

  revealPassphrase() {
    this.router.navigateByUrl('/backup-phrase');
    this.menuController.close('mainMenu');
  }

  myTasks() {
    this.router.navigateByUrl('/my-tasks');
    this.menuController.close('mainMenu');
  }

  openAboutView() {
    this.router.navigateByUrl('/about');
    this.menuController.close('mainMenu');
  }

  openListAccount() {
    this.router.navigateByUrl('/list-account');
    this.menuController.close('mainMenu');
  }

  openSettings() {
    this.router.navigateByUrl('/settings');
    this.menuController.close('mainMenu');
  }

  openAddresBook() {
    this.router.navigateByUrl('/address-book');
    this.menuController.close('mainMenu');
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
    this.menuController.close('mainMenu');
  }

  openHelpSupport() {
    this.router.navigateByUrl('/help');
    this.menuController.close('mainMenu');
  }

  openAppsList() {
    this.router.navigateByUrl('/applist');
    this.menuController.close('mainMenu');
  }

  openNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  openMenu() {
    this.menuController.open('first');
  }

  goToGenerate() {
    this.router.navigateByUrl('/create-account');
    this.menuController.close('mainMenu');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.menuController.close('mainMenu');
  }

}
