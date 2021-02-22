import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-behavior-escrow-summary',
  templateUrl: './behavior-escrow-summary.component.html',
  styleUrls: ['./behavior-escrow-summary.component.scss']
})
export class BehaviorEscrowSummaryComponent implements OnInit {
  @Input() values: any;
  constructor() {}

  convertDate(epoch: any) {
    return new Date(epoch * 1000); // const dt = new Date(0);
    // return dt.setUTCSeconds(epoch).toLocaleString();
  }

  ngOnInit() {

  }
}
