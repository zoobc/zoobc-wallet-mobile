import { Component, Input, OnInit } from '@angular/core';
import { unixTimeStampToDate } from 'src/Helpers/utils';

@Component({
  selector: 'app-behavior-escrow-summary',
  templateUrl: './behavior-escrow-summary.component.html',
  styleUrls: ['./behavior-escrow-summary.component.scss']
})
export class BehaviorEscrowSummaryComponent implements OnInit {
  @Input() values: any;
  constructor() {}

  convertDate(epoch: any) {
    return unixTimeStampToDate(epoch);
  }

  ngOnInit() {

  }
}
