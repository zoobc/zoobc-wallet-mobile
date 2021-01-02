import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-address',
  templateUrl: './info-address.component.html',
  styleUrls: ['./info-address.component.scss']
})
export class InfoAddressComponent implements OnInit {
  @Input() name: string;
  @Input() address: string;

  constructor() {}

  ngOnInit() {}
}
