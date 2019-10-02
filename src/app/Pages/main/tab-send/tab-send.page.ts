import { Component, Inject, OnInit } from "@angular/core";
import {
  ToastController,
  MenuController,
  ModalController,
  NavController,
  AlertController
} from "@ionic/angular";
import { GRPCService } from "src/app/Services/grpc.service";
//import { SendMoneyTx } from "src/helpers/serializers";
import { addressToPublicKey, publicKeyToAddress } from "src/helpers/converters";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { AccountService } from "src/app/Services/account.service";
import { KeyringService } from "src/app/Services/keyring.service";
import { BytesMaker } from "src/helpers/BytesMaker";
import { QrScannerService } from "src/app/Services/qr-scanner.service";
import { ModalConfirmationComponent } from "./modal-confirmation/modal-confirmation.component";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { CurrencyService } from "src/app/Services/currency.service";
import { Account } from "src/app/Interfaces/account";
import { AddressBookService } from "src/app/Services/address-book.service";
import { SelectAddressService } from "src/app/Services/select-address.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-tab-send",
  templateUrl: "tab-send.page.html",
  styleUrls: ["tab-send.page.scss"]
})
export class TabSendPage implements OnInit {
  rootPage: any;
  status: any;
  register: any;
  account: any;
  sender: any;
  recipient: any;
  amount: any;
  fee: any;

  sendForm;

  conversionValue = {
    amount: {
      ZBC: 0,
      USD: 0
    },
    fee: {
      ZBC: 0,
      USD: 0
    }
  };

  formSubmitted: boolean = false;

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
    private formBuilder: FormBuilder,
    private currencySrv: CurrencyService,
    private addressBookSrv: AddressBookService,
    private selectAddressSrv: SelectAddressService,
    private alertCtrl: AlertController
  ) {
    // this.sender = this.getAddress();
  }

  ngOnInit() {
    this.sendForm = this.formBuilder.group({
      sender: new FormControl("", Validators.compose([Validators.required])),
      recipient: new FormControl("", Validators.compose([Validators.required])),
      amount: new FormControl("", Validators.compose([Validators.required])),
      amountCurr: new FormControl(
        "ZBC",
        Validators.compose([Validators.required])
      ),
      fee: new FormControl("", Validators.compose([Validators.required])),
      feeCurr: new FormControl(
        "ZBC",
        Validators.compose([Validators.required])
      ),
      saveToAddreesBook: false,
      alias: ""
    });

    this.sendForm
      .get("saveToAddreesBook")
      .valueChanges.subscribe(saveToAddreesBook => {
        const alias = this.sendForm.get("alias");

        if (saveToAddreesBook) {
          alias.setValidators([Validators.required]);
        } else {
          alias.setValidators(null);
        }

        alias.updateValueAndValidity();
      });
  }

  openMenu() {
    this.menuController.open("mainMenu");
  }

  async getAddress() {
    this.account = await this.storage.get("active_account");
    this.sender = this.accountService.getAccountAddress(this.account);
  }

  onAmountKeyUp(event) {
    const amount = this.sendForm.get("amount").value;
    const amountCurr = this.sendForm.get("amountCurr").value;
    this.conversionValue.amount.ZBC = this.currencySrv.convertCurrency(
      amount,
      amountCurr,
      "ZBC"
    );
    this.conversionValue.amount.USD = this.currencySrv.convertCurrency(
      amount,
      amountCurr,
      "USD"
    );
  }

  onFeeKeyUp(event) {
    const fee = this.sendForm.get("fee").value;
    const feeCurr = this.sendForm.get("feeCurr").value;
    this.conversionValue.fee.ZBC = this.currencySrv.convertCurrency(
      fee,
      feeCurr,
      "ZBC"
    );
    this.conversionValue.fee.USD = this.currencySrv.convertCurrency(
      fee,
      feeCurr,
      "USD"
    );
  }

  async presentConfirmationModal() {
    const senderValue = this.sendForm.get("sender").value;
    const modal = await this.modalController.create({
      component: ModalConfirmationComponent,
      componentProps: {
        sender: senderValue.address,
        recipient: this.sendForm.get("recipient").value,
        amount: {
          ZBC: this.conversionValue.amount.ZBC,
          USD: this.conversionValue.amount.USD
        },
        fee: {
          ZBC: this.conversionValue.fee.ZBC,
          USD: this.conversionValue.fee.USD
        }
      }
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data && returnVal.data.confirm) {
        this.confirm();
      }
    });

    return await modal.present();
  }

  resetForm() {
    this.sendForm.reset({
      amountCurr: "ZBC",
      feeCurr: "ZBC"
    });
  }

  onSubmit() {
    (<any>Object).values(this.sendForm.controls).forEach(control => {
      control.markAsDirty();
      control.markAsTouched();
    });

    if (this.sendForm.valid) {
      this.presentConfirmationModal();
    }
  }

  async confirm() {
    const selectedAccount: Account = this.sendForm.get("sender").value;
    const { accountProps } = selectedAccount;

    const { derivationPrivKey: accountSeed } = accountProps;

    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);

    //form value
    const sender = Buffer.from(publicKeyToAddress(publicKey), "utf-8");

    const _recipient = this.sendForm.get("recipient").value;
    const recipient = Buffer.from(_recipient, "utf-8");

    const _amount = this.sendForm.get("amount").value;
    const amountCurr = this.sendForm.get("amountCurr").value;
    const convertedAmount = this.currencySrv.convertCurrency(
      _amount,
      amountCurr,
      "ZBC"
    );
    const amount = convertedAmount * 1e8;

    const _fee = this.sendForm.get("fee").value;
    const feeCurr = this.sendForm.get("feeCurr").value;
    const convertedFee = this.currencySrv.convertCurrency(_fee, feeCurr, "ZBC");
    const fee = convertedFee * 1e8;

    const timestamp = Math.trunc(Date.now() / 1000);

    const alias = this.sendForm.get("alias").value;

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
    // recipient address length
    bytes.write4bytes(44);
    // recipient address
    bytes.write44Bytes(recipient);
    // tx fee
    bytes.write8Bytes(fee);
    // tx body length
    bytes.write4bytes(8);
    // tx body (amount)
    bytes.write8Bytes(amount);

    const signature = this.sign.detached(bytes.value, secretKey);

    //let signature = childSeed.sign(bytes.value);

    let bytesWithSign = new BytesMaker(197);

    // copy to new bytes
    bytesWithSign.write(bytes.value, 129);
    // set signature type
    bytesWithSign.write4bytes(0);
    // set signature
    bytesWithSign.write(signature, 64);

    const resolveTx = await this.grpcService.postTransaction(
      bytesWithSign.value
    );

    if (resolveTx) {
      this.presentAlertTransactionSuccess();

      this.resetForm();

      if (this.sendForm.get("saveToAddreesBook").value) {
        this.addressBookSrv.save(alias, _recipient);
      }
    }
  }

  async presentAlertTransactionSuccess() {
    const alert = await this.alertCtrl.create({
      header: "Success",
      message: "Money Sent",
      buttons: ["OK"]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    //this.getAddress();
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
    this.selectAddressSrv.onSelect().subscribe(addressObj => {
      this.sendForm.patchValue({
        recipient: addressObj.address
      });
    });

    this.navCtrl.navigateForward("select-address");
  }
}