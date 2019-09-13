import { Component, Inject, OnInit } from "@angular/core";
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
import { KeyringService } from "src/app/Services/keyring.service";
import { BytesMaker } from "src/helpers/BytesMaker";
import { QrScannerService } from "src/app/Services/qr-scanner.service";
import { ModalConfirmationComponent } from "./modal-confirmation/modal-confirmation.component";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { CurrencyService } from "src/app/Services/currency.service";
import { Account } from "src/app/Interfaces/account";
import { AddressBookService } from "src/app/Services/address-book.service";
import { SelectAddressService } from "src/app/Services/select-address.service";

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
    private selectAddressSrv: SelectAddressService
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

  onSubmit() {
    this.formSubmitted = true;

    if (this.sendForm.valid) {
      this.presentConfirmationModal();
    }
  }

  async confirm() {
    const selectedAccount: Account = this.sendForm.get("sender").value;
    const { accountProps } = selectedAccount;

    const { derivationPrivKey: accountSeed } = accountProps;
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
    const recepient = Buffer.from(
      this.sendForm.get("recepient").value,
      "utf-8"
    );
    const _amount = this.sendForm.get("amount");
    const amountCurr = this.sendForm.get("amountCurr");
    const convertedAmount = this.currencySrv.convertCurrency(
      _amount,
      amountCurr,
      "ZBC"
    );
    const amount = convertedAmount * 1e8;

    const _fee = this.sendForm.get("fee");
    const feeCurr = this.sendForm.get("feeCurr");
    const convertedFee = this.currencySrv.convertCurrency(_fee, feeCurr, "ZBC");
    const fee = convertedFee * 1e8;

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
