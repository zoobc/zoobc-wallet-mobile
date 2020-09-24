import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-action',
  templateUrl: './popover-action.component.html',
  styleUrls: ['./popover-action.component.scss']
})
export class PopoverActionComponent implements OnInit {

  accounts: any[];
  selectedIndex: number;

  constructor(
    public popoverCtrl: PopoverController,
  ) { }

  async ngOnInit() {
  }

  dismiss(action: string) {
    this.popoverCtrl.dismiss(action);
  }

}
