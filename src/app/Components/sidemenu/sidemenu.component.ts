import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';
import { FcmService } from 'src/app/Services/fcm.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  theme = DEFAULT_THEME;
  toggle: any;

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private fcm: FcmService,
    private router: Router,
    private themeSrv: ThemeService,
    private statusBar: StatusBar
  ) {

    // if account changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });


  }

  async ngOnInit() {
    this.theme = this.themeSrv.theme;
  }


//  themes() {

//    this.toggle = document.querySelector('#themeToggle');
//    this.toggle.addEventListener('ionChange', (ev: { detail: { checked: boolean; }; }) => {

//      console.log('===== Makan Hati =====');
//      document.body.classList.toggle('dark', true);

//      if (ev.detail.checked) {
//          this.statusBar.backgroundColorByHexString('#121212');
//          this.statusBar.styleLightContent();
//        } else {
//          this.statusBar.backgroundColorByHexString('#ffffff');
//          this.statusBar.styleDefault();
//        }
//    });

//    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

//    // tslint:disable-next-line: deprecation
//    prefersDark.addListener((e) => checkToggle(e.matches));

//    function checkToggle(shouldCheck) {
//      this.toggle.checked = shouldCheck;
//    }

//  }

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

    const user =  this.fcm.chatUser;
    console.log('=== current chat user: ',  user);

    if (user) {
      this.fcm.delete(user);
    }

    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.menuController.close('mainMenu');
  }

}
