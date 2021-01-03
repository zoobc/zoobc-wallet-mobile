import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { NetworkService } from 'src/app/Services/network.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ZbcNetwork } from 'src/app/Interfaces/zbc-network';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  form: FormGroup;
  networks = [];
  activeNetwork = null;
  fName = new FormControl('', Validators.required);
  fHost = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  actionMode = 'add';
  idx = 0;
  isShowForm = false;
  textEdit = 'edit';
  textDelete = 'delete';

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertController: AlertController,
    private networkSrv: NetworkService
  ) { }



  async ngOnInit() {
    this.networks = this.networkSrv.getall();
    this.form = new FormGroup({
      name: this.fName,
      host: this.fHost
    });
    this.activeNetwork = await this.networkSrv.getNetwork();
  }

  selectNetwork(index: any) {
    this.networkSrv.setNetwork(index);
    this.networkSrv.broadcastSelectNetwork(this.networks[index]);
    this.navCtrl.pop();
  }

  get errorControl() {
    return this.form.controls;
  }

  addHost() {
    this.actionMode = 'add';
    this.showForm();
  }

  showForm() {
    this.isShowForm = true;
  }

  edit(idx: number) {
    this.actionMode = 'edit';
    this.idx = idx;
    this.isShowForm = true;
    const network =   this.networks[this.idx];
    this.fName.setValue(network.name);
    this.fHost.setValue(network.host);
  }

  async delete(idx: number) {
    this.idx = idx;
    this.networks.splice(this.idx, 1);
    console.log('== this.networks after delte:', this.networks);
    await this.networkSrv.saveAll(this.networks);
  }

  close() {
    this.isShowForm = false;
  }

  async deleteConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure <strong>to delete</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.delete(this.idx);
          }
        }
      ]
    });

    await alert.present();
  }

  async save(): Promise<void> {

    this.fHost.markAsTouched();
    this.fName.markAsTouched();

    if (!this.form.valid) {
      console.log('Please provide all the required values!');
      return;
    }

    const newHost: ZbcNetwork = {
      name: this.fName.value,
      host: this.fHost.value,
      default: false,
    };

    console.log('=== newHost: ', newHost);
    if (this.actionMode === 'add') {
      console.log(' == will add', newHost);
      await this.networkSrv.add(newHost);
    } else if (this.actionMode === 'edit') {
      console.log(' == will edit', newHost);
      this.networks[this.idx] = newHost;
      await this.networkSrv.saveAll(this.networks);
    }
    this.networks = this.networkSrv.getall();
    console.log('== Sekarang: ', this.form.value);
    this.isShowForm = false;
  }

  async showOption(ev: any, index: number) {

    this.idx = index;
    const popoverOptions = [
      {
        key: 'edit',
        label: this.textEdit
      },
      {
        key: 'delete',
        label: this.textDelete
      }
    ];

    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: popoverOptions
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data: action }) => {
      switch (action) {
        case 'edit':
          this.edit(index);
          break;
        case 'delete':
          this.deleteConfirmation();
          break;
      }
    });

    return popover.present();
  }

}
