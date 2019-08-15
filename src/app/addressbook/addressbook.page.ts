import { Component, OnInit } from "@angular/core";
import { ModalAddressbookComponent } from "./modal-addressbook/modal-addressbook.component";
import { NavController, ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-addressbook",
  templateUrl: "./addressbook.page.html",
  styleUrls: ["./addressbook.page.scss"]
})
export class AddressbookPage implements OnInit {
  constructor(
    private navtrl: NavController,
    public modalController: ModalController,
    private storage: Storage
  ) {}

  addresses: any = [];

  ngOnInit() {
    this.storage.get("addresses").then(data => {
      this.addresses = data;
    });
  }

  createNewAddress() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalAddressbookComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data.address) {
        const address = returnVal.data.address;

        this.addresses.push(address);
      }
    });

    return await modal.present();
  }
}
