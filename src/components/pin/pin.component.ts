import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit {
  private pin = ""

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  emitEvent() {
    this.change.emit(this.pin);
    this.pin = ""
  }

  handleInput(pin: string) {

    if (pin === "clear") {
      this.pin = "";
      return;
    }

    if (this.pin.length === 4) {
      return;
    }
    this.pin += pin;
  }

}
