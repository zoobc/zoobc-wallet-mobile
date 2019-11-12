import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { Observable } from "rxjs";

@Component({
  selector: "app-pin",
  templateUrl: "./pin.component.html",
  styleUrls: ["./pin.component.scss"]
})
export class PinComponent implements OnInit {
  pin = "";
  dots = [];
  numbers = [];

  obs: any;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() onTouched: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.dots = Array(6)
      .fill(null)
      .map((x, i) => i);
    this.numbers = Array(9)
      .fill(null)
      .map((x, i) => i);
  }

  ngOnInit() {}

  clear() {
    this.pin = "";
    this.onTouched.emit(false);
  }

  backSpace() {
    let l = this.pin.length;
    if (l > 0) {
      l = l - 1;
    }
    this.pin = this.pin.substring(0, l);
  }

  handleInput(pin: number) {
    this.pin += pin;

    if (this.pin.length >= 1) {
      this.onTouched.emit(true);
    }

    if (this.pin.length == 6) {
      this.pinSubmit();
    }
  }

  pinSubmit() {
    this.obs = new Observable(observer => {
      this.onChange.emit({
        observer,
        pin: this.pin
      });
    });

    const a = this.obs.subscribe(v => {
      this.pin = v;

      a.unsubscribe();
    });
  }
}
