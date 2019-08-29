import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SetupPinService {
  data: any = {};
  constructor() {}

  public setupPinSubject: Subject<any> = new Subject<any>();

  setStatus(data: any) {
    this.data = data;

    this.setupPinSubject.next(this.data);
  }
}
