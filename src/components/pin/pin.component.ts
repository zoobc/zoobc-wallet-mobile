import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit {
  pin = ""
  dots = [];
  numbers = [];

  obs: any;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.dots = Array(6).fill(null).map((x, i) => i);
    this.numbers = Array(9).fill(null).map((x, i) => i);
  }

  ngOnInit() {
  }

  clear() {
    this.pin = "";
  }

  handleInput(pin: string) {

    this.pin += pin;

    if (this.pin.length === 6) {
      this.obs = new Observable(observer => {
        this.onChange.emit({
          observer,
          pin: this.pin
        })
      });

      this.obs.subscribe((v) => {
        this.pin = "";
      })
    }
  }

}
