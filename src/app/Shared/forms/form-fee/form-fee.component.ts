import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "form-fee",
  templateUrl: "./form-fee.component.html",
  styleUrls: ["./form-fee.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFeeComponent),
      multi: true
    }
  ]
})
export class FormFeeComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  value;

  _fees = [];

  customFee: boolean = false;

  buttonColors: string[] = [];

  @Input() set fees(value) {
    this._fees = value;
  }

  @Output() changed: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  onFeeClicked(index) {
    this.buttonColors = [];
    this.buttonColors[index] = "primary";

    const fee = this._fees[index].value;
    this.customFee = false;

    this.changed.emit(fee);
    this.changeData(fee);
  }

  onFeeKeyUp(event) {
    const fee = event.target.value;
    this.changed.emit(fee);
    this.changeData(fee);
  }

  toggleCustomFee() {
    this.buttonColors = [];

    this.changed.emit(0);
    this.changeData(0);
  }

  changeData(data) {
    this.value = data;
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.changeData = fn;
  }
  registerOnTouched(fn: any) {}
}
