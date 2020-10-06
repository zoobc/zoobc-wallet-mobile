import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-option',
  templateUrl: './popover-option.component.html'
})
export class PopoverOptionComponent implements OnInit {

  accounts: any[];
  selectedIndex: number;

  @Input() options: {key: string, label: string, icon?: string}[];

  constructor(
    public popoverCtrl: PopoverController,
  ) { }

  async ngOnInit() {
  }

  dismiss(option: string) {
    this.popoverCtrl.dismiss(option);
  }

}
