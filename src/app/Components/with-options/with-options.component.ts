import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverOptionComponent } from '../popover-option/popover-option.component';

interface IWithOptions{
  key: string;
  label: string;
}

@Component({
  selector: 'app-with-options',
  templateUrl: './with-options.component.html',
  styleUrls: ['./with-options.component.scss'],
})
export class WithOptionsComponent {

  @Input() options: IWithOptions[];
  @Output() onClose = new EventEmitter<string>();
  
  constructor(private popoverController: PopoverController) { }

  async showOption(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: this.options
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({data}) => {
      this.onClose.emit(data);
    });

    return popover.present();
  }

}
