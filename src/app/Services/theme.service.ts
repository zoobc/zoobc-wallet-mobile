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
      primary: '#0B3D65',
      secondary: '#0099c4',
      tertiary: '#d35555',
      light: '#f4f5f8',
      medium: '#ffffff',
      dark: '#020202',
      dbbalance: '#eae3d0',
      dbspbalance: '#3399cc'
    },
    day: {
      primary: '#3880ff',
      secondary: '#3dc2ff',
      tertiary: '#5260ff',
      light: '#f4f5f8',
      medium: '#000000',
      dark: '#222428',
      dbbalance: '#ffe8df',
      dbspbalance: '#ffdf7b'
    },
    night: {
      primary: '#222831',
      secondary: '#222831',
      tertiary: '#30475e',
      medium: '#ffbd69',
      dark: '#543864',
      light: '#dbdbdb',
      dbbalance: '#ececec',
      dbspbalance: '#c1a57b'
    }
  };


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private strgSrv: StoragedevService
  ) {
  }

  public themeSubject: Subject<string> = new Subject<string>();
  // Override all global variables with a new theme
  async setTheme(themename: string) {
    this.theme = themename;
    this.themeSubject.next(this.theme);
    const them = this.themes[themename];
    const cssText = CSSTextGenerator(them);
    this.setGlobalCSS(cssText);
    await this.strgSrv.set(STORAGE_ACTIVE_THEME, themename);
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
  primary: '#3880ff',
  secondary: '#0cd1e8',
  tertiary: '#7044ff',
  danger: '#f04141',
  dark: '#222428',
  medium: '#989aa2',
  light: '#f4f5f8',
  dbbalance: '#1ca3b0',
  dbspbalance: '#eae3d0',
  success: '#10dc60',
  warning: '#ffce00'
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
    --ion-color-light-contrast: $${contrast(light)};
    --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
    --ion-color-light-tint: ${Color(light).lighten(tintRatio)};

    --ion-color-dbbalance: ${dbbalance};
    --ion-color-dbbalance-rgb: 244,244,244;
    --ion-color-dbbalance-contrast: $${contrast(dbbalance)};
    --ion-color-dbbalance-contrast-rgb: 0,0,0;
    --ion-color-dbbalance-shade: ${Color(dbbalance).darken(shadeRatio)};
    --ion-color-dbbalance-tint: ${Color(dbbalance).lighten(tintRatio)};

    --ion-color-dbspbalance: ${dbspbalance};
    --ion-color-dbspbalance-rgb: 244,244,244;
    --ion-color-dbspbalance-contrast: $${contrast(dbspbalance)};
    --ion-color-dbspbalance-contrast-rgb: 0,0,0;
    --ion-color-dbspbalance-shade: ${Color(dbspbalance).darken(shadeRatio)};
    --ion-color-dbspbalance-tint: ${Color(dbspbalance).lighten(tintRatio)};`;
}

function contrast(color, ratio = 0.8) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}