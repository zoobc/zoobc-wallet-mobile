import {
  Component,
  forwardRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { IBlockchainObjectItem } from 'src/app/Interfaces/bc-object-item';
import { PopoverBlockchainObjectComponent } from './popover-blockchain-object/popover-blockchain-object.component';

@Component({
  selector: 'app-form-get-object',
  templateUrl: './form-get-object.component.html',
  styleUrls: ['./form-get-object.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGetObjectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormGetObjectComponent implements OnInit, ControlValueAccessor {
  public blockchainObjectItem: IBlockchainObjectItem = {
    title: 'ZBO_F6CRZPOG_C42A7M37_WRL2EVBV_KA5PKBGI_SBGVZHMH_VIFZ7CMQ_VMOFWD3P',
    desc: '2 minutes ago'
  };

  constructor(
    private popoverCtrl: PopoverController,
  ) {}

  async ngOnInit() {}

  async switchBlockchainObject(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverBlockchainObjectComponent,
      event: ev,
      cssClass: 'popover-blockchain-object',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: IBlockchainObjectItem }) => {
      if (data) {
        this.blockchainObjectItem = data;
        this.onChange(data);
      }
    });

    return popover.present();
  }

  onChange = (value: IBlockchainObjectItem) => {};

  onTouched = () => {};

  writeValue(value: IBlockchainObjectItem) {
    this.blockchainObjectItem = value;
  }

  registerOnChange(fn: (value: IBlockchainObjectItem) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
