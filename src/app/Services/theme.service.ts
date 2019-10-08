import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private defaultTheme = "zoo";
  private _theme;

  themeSubject = new BehaviorSubject<string>(this.defaultTheme);

  constructor() {}

  set theme(value) {
    this._theme = value;
    this.themeSubject.next(value);
  }

  get theme() {
    return this._theme;
  }
}
