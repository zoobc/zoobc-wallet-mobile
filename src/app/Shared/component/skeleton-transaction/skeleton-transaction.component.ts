import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-transaction',
  templateUrl: './skeleton-transaction.component.html',
  styleUrls: ['./skeleton-transaction.component.scss']
})
export class SkeletonTransactionComponent implements OnInit {
  @Input() item: number;

  public skeleton: {
    titleLength: string;
    dateLength: string;
    mainAmountLength: string;
    otherAmountLength: string;
  };

  public randomTitleLength = [80, 40];
  public randomDateLength = [30, 50];
  public randomAmountLength = [60, 50];
  public randomOtherAmountLength = [40, 30];

  constructor() {}

  ngOnInit() {
    this.skeleton = {
      titleLength: this.randomTitleLength[this.getRandomInt(0, 1)] + '%',
      dateLength: this.randomDateLength[this.getRandomInt(0, 1)] + '%',
      mainAmountLength: this.randomAmountLength[this.getRandomInt(0, 1)] + '%',
      otherAmountLength:
        this.randomOtherAmountLength[this.getRandomInt(0, 1)] + '%'
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
