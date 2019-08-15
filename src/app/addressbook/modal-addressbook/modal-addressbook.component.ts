import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-modal-addressbook",
  templateUrl: "./modal-addressbook.component.html",
  styleUrls: ["./modal-addressbook.component.scss"]
})
export class ModalAddressbookComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private storage: Storage) {}

  name: string;
  address: string;

  addresses = [];

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async addAddress() {
    const _addresses = await this.storage.get("addresses");
    const addresses = _addresses ? _addresses : [];

    const address = {
      name: this.name,
      address: this.address,
      created: new Date()
    };

    await this.storage.set("addresses", [...addresses, address]);

    this.modalCtrl.dismiss({
      address
    });
  }
}
