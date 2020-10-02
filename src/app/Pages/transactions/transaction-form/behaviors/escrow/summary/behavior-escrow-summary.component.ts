import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-behavior-escrow-summary',
  templateUrl: './behavior-escrow-summary.component.html',
  styleUrls: ['./behavior-escrow-summary.component.scss']
})
export class BehaviorEscrowSummaryComponent implements OnInit {
  @Input() values: any;
  constructor() {}

  ngOnInit() {
    console.log('__values', this.values);
  }
}
