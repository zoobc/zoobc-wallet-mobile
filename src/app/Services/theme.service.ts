import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as Color from 'color';
import { STORAGE_ACTIVE_THEME, DEFAULT_THEME } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = DEFAULT_THEME;
  themes = {
    zoobc: {
      primary: '#28456D',
      secondary: '#041C3F',
      tertiary: '#4576BA',
      dbbalance: '#cccddd',
      dbspbalance: '#6E6E6E',
      pinbutton: '#ffffff'
    },
    bcz: {
      primary: '#005b96',
      secondary: '#6497b1',
      tertiary: '#03396c',
      dbbalance: '#cccddd',
      pinbutton: '#ffffff',
      dbspbalance: '#6E6E6E'
    },
    day: {
      primary: '#317873',
      secondary: '#5f9ea0',
      tertiary: '#49796b',
      dbbalance: '#dddddd',
      pinbutton: '#ffffff',
      dbspbalance: '#6E6E6E'
    },
    night: {
      primary: '#737373',
      secondary: '#737373',
      tertiary: '#FE5F55',
      medium: '#BCC2C7',
      dark: '#dedede',
      light: '#000000',
      pinbutton: '#ffffff',
      dbbalance: '#dddddd',
      dbspbalance: '#6E6E6E'
    },
    neon: {
      primary: '#39BFBD',
      secondary: '#4CE0B3',
      tertiary: '#FF5E79',
      light: '#F4EDF2',
      medium: '#B682A5',
      dark: '#34162A',
      pinbutton: '#ffffff',
      dbbalance: '#ececec',
      dbspbalance: '#6E6E6E'
    },
    autumn: {
      primary: '#F78154',
      secondary: '#4D9078',
      tertiary: '#B4436C',
      light: '#FDE8DF',
      medium: '#FCD0A2',
      dark: '#B89876',
      pinbutton: '#ffffff',
      dbbalance: '#ececec',
      dbspbalance: '#6E6E6E'
    }
  };
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private strgSrv: StoragedevService
  ) {
    strgSrv.get(STORAGE_ACTIVE_THEME).then(themeName => {  // <--- GET SAVED THEME
      let thm = themeName;
      if (!thm) {
        thm = DEFAULT_THEME;
      }
      this.setTheme(thm);
    });

  }

  public themeSubject: Subject<string> = new Subject<string>();
  public selectThemeSubject: Subject<string> = new Subject<string>();
  // Override all global variables with a new theme
  async setTheme(themename: string) {
    this.theme = themename;
    const them = this.themes[themename];
    const cssText = CSSTextGenerator(them);
    this.setGlobalCSS(cssText);
    await this.strgSrv.set(STORAGE_ACTIVE_THEME, themename);
    this.themeSubject.next(this.theme);
  }

  broadcastSelectTheme(value: string){
    this.selectThemeSubject.next(value)
  }
  // Define a single CSS variable
  setVariable(name: string, value: string) {
    this.document.documentElement.style.setProperty(name, value);
  }

  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }

}

const defaults = {
  primary: '#1d2647',
  secondary: '#6cc3d8',
  tertiary: '#2C85FB',
  light: '#f4f5f8',
  medium: '#92949c',
  dark: '#222428',
  dbbalance: '#eae3d0',
  dbspbalance: '#2C85FB',
  pinbutton: '#ffffff',
  danger: '#eb445a',
  success: '#2dd36f',
  warning: '#ffc409'
};

function CSSTextGenerator(colors) {
  colors = { ...defaults, ...colors };

  const {
    primary,
    secondary,
    tertiary,
    success,
    warning,
    danger,
    dark,
    medium,
    light,
    dbbalance,
    dbspbalance
  } = colors;

  const shadeRatio = 0.1;
  const tintRatio = 0.1;

  return `
    --ion-color-base: ${light};
    --ion-color-contrast: ${dark};
    --ion-background-color: ${light};
    --ion-text-color: ${dark};
    --ion-toolbar-background-color: ${contrast(light, 0.1)};
    --ion-toolbar-text-color: ${contrast(dark, 0.1)};
    --ion-item-background-color: ${contrast(light, 0.3)};
    --ion-item-text-color: ${contrast(dark, 0.3)};

    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 11,61,101;
    --ion-color-primary-contrast: #ffffff;
    --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};
    --ion-color-primary-tint:  ${Color(primary).lighten(tintRatio)};

    --ion-color-secondary: ${secondary};
    --ion-color-secondary-rgb: 12,209,232;
    --ion-color-secondary-contrast: #ffffff;
    --ion-color-secondary-contrast-rgb: 255,255,255;
    --ion-color-secondary-shade:  ${Color(secondary).darken(shadeRatio)};
    --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};

    --ion-color-tertiary:  ${tertiary};
    --ion-color-tertiary-rgb: 112,68,255;
    --ion-color-tertiary-contrast: #ffffff;
    --ion-color-tertiary-contrast-rgb: 255,255,255;
    --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
    --ion-color-tertiary-tint:  ${Color(tertiary).lighten(tintRatio)};

    --ion-color-success: ${success};
    --ion-color-success-rgb: 16,220,96;
    --ion-color-success-contrast: ${contrast(success)};
    --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
    --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

    --ion-color-warning: ${warning};
    --ion-color-warning-rgb: 255,206,0;
    --ion-color-warning-contrast: ${contrast(warning)};
    --ion-color-warning-contrast-rgb: 255,255,255;
    --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
    --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

    --ion-color-danger: ${danger};
    --ion-color-danger-rgb: 245,61,61;
    --ion-color-danger-contrast: ${contrast(danger)};
    --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
    --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

    --ion-color-dark: ${dark};
    --ion-color-dark-rgb: 34,34,34;
    --ion-color-dark-contrast: ${contrast(dark)};
    --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
    --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

    --ion-color-medium: ${medium};
    --ion-color-medium-rgb: 152,154,162;
    --ion-color-medium-contrast: ${contrast(medium)};
    --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
    --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

    --ion-color-light: ${light};
    --ion-color-light-rgb: 244,244,244;
    --ion-color-light-contrast: ${contrast(light)};
    --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
    --ion-color-light-tint: ${Color(light).lighten(tintRatio)};

    --ion-color-dbbalance: ${dbbalance};
    --ion-color-secondary-rgb: 112,68,255;
    --ion-color-dbbalance-contrast: #ffffff;
    --ion-color-dbbalance-contrast-rgb: 0,0,0;
    --ion-color-dbbalance-shade: ${Color(dbbalance).darken(shadeRatio)};
    --ion-color-dbbalance-tint: ${Color(dbbalance).lighten(tintRatio)};

    --ion-color-pinbutton: ${dbspbalance};
    --ion-color-pinbutton-rgb: 112,68,255;
    --ion-color-pinbutton-contrast: #ffffff;
    --ion-color-pinbutton-contrast-rgb: 0,0,0;
    --ion-color-pinbutton-shade: ${Color(dbspbalance).darken(shadeRatio)};
    --ion-color-pinbutton-tint: ${Color(dbspbalance).lighten(tintRatio)};

    --ion-color-dbspbalance: ${dbspbalance};
    --ion-color-dbspbalance-rgb: 112,68,255;
    --ion-color-dbspbalance-contrast: #ffffff;
    --ion-color-dbspbalance-contrast-rgb: 0,0,0;
    --ion-color-dbspbalance-shade: ${Color(dbspbalance).darken(shadeRatio)};
    --ion-color-dbspbalance-tint: ${Color(dbspbalance).lighten(tintRatio)};`;
}

function contrast(color, ratio = 0.8) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}
