import { Component, Inject } from "@angular/core";
import {
  ToastController,
  MenuController,
  ModalController,
  NavController
} from "@ionic/angular";
import { GRPCService } from "src/app/Services/grpc.service";
import { SendMoneyTx } from "src/helpers/serializers";
import { addressToPublicKey, publicKeyToAddress } from "src/helpers/converters";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { AccountService } from "src/app/Services/account.service";
import { ModalAddressBookComponent } from "./modal-address-book/modal-address-book.component";
import { KeyringService } from "src/app/Services/keyring.service";
import { BytesMaker } from "src/helpers/BytesMaker";
import { QrScannerService } from "src/app/Services/qr-scanner.service";
import { ModalConfirmationComponent } from "./modal-confirmation/modal-confirmation.component";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-tab-send",
  templateUrl: "tab-send.page.html",
  styleUrls: ["tab-send.page.scss"]
})
export class TabSendPage {
  rootPage: any;
  status: any;
  register: any;
  account: any;
  sender: any;
  recipient: any;
  amount: any;
  fee: any;

  sendForm;

  constructor(
    private storage: Storage,
    @Inject("nacl.sign") private sign: any,
    private grpcService: GRPCService,
    private toastController: ToastController,
    private accountService: AccountService,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private keyringServ: KeyringService,
    private formBuilder: FormBuilder
  ) {
    // this.sender = this.getAddress();

    this.sendForm = this.formBuilder.group({
      sender: "",
      recipient: "",
      amount: "",
      fee: ""
    });
  }

  openMenu() {
    this.menuController.open("mainMenu");
  }

  async getAddress() {
    this.account = await this.storage.get("active_account");
    this.sender = this.accountService.getAccountAddress(this.account);
  }

  onSubmit() {
    this.presentConfirmationModal();
  }

  async presentConfirmationModal() {
    const modal = await this.modalController.create({
      component: ModalConfirmationComponent,
      componentProps: {
        sender: this.sendForm.get("sender").value,
        recipient: this.sendForm.get("recipient").value,
        amount: this.sendForm.get("amount").value,
        fee: this.sendForm.get("fee").value
      }
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data && returnVal.data.confirm) {
        this.confirm();
      }
    });

    return await modal.present();
  }

  async confirm() {
    const { derivationPrivKey: accountSeed } = this.account.accountProps;
    console.log("this.account.accountProps: ", this.account.accountProps);
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);

    // const balance = await this.grpcService.getAccountBalance();

    // if (balance > this.account + this.fee) {
    //   const tx = new SendMoneyTx();
    //   tx.senderPublicKey = publicKey;
    //   tx.recipientPublicKey = addressToPublicKey(this.recipient);
    //   tx.amount = this.amount;
    //   tx.fee = this.fee;
    //   tx.timestamp = Date.now() / 1000;
    //   const txBytes = tx.toBytes();

    //   const signature = this.sign.detached(txBytes, secretKey);
    //   txBytes.set(signature, 123);

    //   const resolveTx = await this.grpcService.postTransaction(txBytes);

    //   if (resolveTx) {
    //     this.transactionToast("Money Sent");
    //   }
    // } else {
    //   this.transactionToast("Balance not enough");
    // }

    const sender = Buffer.from(publicKeyToAddress(publicKey), "utf-8");
    const recepient = Buffer.from(this.recipient, "utf-8");
    const amount = this.amount * 1e8;
    const fee = this.fee;
    const timestamp = Math.trunc(Date.now() / 1000);

    let bytes = new BytesMaker(129);
    // transaction type
    bytes.write4bytes(1);
    // version
    bytes.write1Byte(1);
    // timestamp
    bytes.write8Bytes(timestamp);
    // sender address length
    bytes.write4bytes(44);
    // sender address
    bytes.write44Bytes(sender);
    // recepient address length
    bytes.write4bytes(44);
    // recepient address
    bytes.write44Bytes(recepient);
    // tx fee
    bytes.write8Bytes(fee);
    // tx body length
    bytes.write4bytes(8);
    // tx body (amount)
    bytes.write8Bytes(amount);

    const signature = this.sign.detached(bytes.value, secretKey);
    let bytesWithSign = new BytesMaker(193);

    // copy to new bytes
    bytesWithSign.write(bytes.value, 129);
    // set signature
    bytesWithSign.write(signature, 64);
    console.log(bytesWithSign.value);

    const resolveTx = await this.grpcService.postTransaction(
      bytesWithSign.value
    );

    if (resolveTx) {
      this.transactionToast("Money Sent");
      this.recipient = "";
      this.amount = 0;
      this.fee = 0;
    }
  }

  async transactionToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.getAddress();
  }

  scanQrCode() {
    this.navCtrl.navigateForward("qr-scanner");

    this.qrScannerSrv.listen().subscribe((str: string) => {
      this.sendForm.patchValue({
        recipient: str
      });
    });
  }

  openAddresses() {
    this.presentModalAddressesList();
  }

  async presentModalAddressesList() {
    const modal = await this.modalController.create({
      component: ModalAddressBookComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data && returnVal.data.address) {
        this.sendForm.patchValue({
          recipient: returnVal.data.address
        });
      }
    });

    return await modal.present();
  }
}
