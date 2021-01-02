import { Component, OnInit } from '@angular/core';
import { THEME_OPTIONS, STORAGE_ACTIVE_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.page.html',
  styleUrls: ['./theme.page.scss'],
})
export class ThemePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private themeSrv: ThemeService,
    private strgSrv: StorageService
  ) { }

  public themes = THEME_OPTIONS;

  public activeTheme = null

  async ngOnInit() {
    this.activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
  }

  selectTheme(themeName: string){
    this.themeSrv.setTheme(themeName)
    this.themeSrv.broadcastSelectTheme(themeName);
    this.navCtrl.pop();
  }

}
