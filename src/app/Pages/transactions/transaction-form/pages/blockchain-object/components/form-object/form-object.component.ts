import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface IFormObject {
  key: string;
  value: string;
}

@Component({
  selector: 'app-form-object',
  templateUrl: './form-object.component.html',
  styleUrls: ['./form-object.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormObjectComponent),
      multi: true
    }
  ]
})
export class FormObjectComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  @Input() errors: any;
  
  key: string;
  value: string;

  ngOnInit() {}

  changeValue = () => {
    this.onChange({
      key: this.key,
      value: this.value
    });
  }

  onChange = ({key, value}: IFormObject) => {};

  onTouched = () => {};

  writeValue({key, value}: IFormObject) {
    this.key = key;
    this.value = value;
  }

  registerOnChange(fn: ({key, value}: IFormObject) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
