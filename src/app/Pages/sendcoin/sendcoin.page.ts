import { Component, Inject, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';
import {
  ToastController,
  MenuController,
  ModalController
} from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction.service';
import { publicKeyToAddress, base64ToByteArray } from 'src/app/helpers/converters';
import { Storage } from '@ionic/storage';
import { QrScannerService } from 'src/app/qr-scanner/qr-scanner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AddressBookModalComponent } from './address-book-modal/address-book-modal.component';
import { BytesMaker } from 'src/app/helpers/BytesMaker';
import { GetAccountBalanceResponse } from 'src/app/grpc/model/accountBalance_pb';
import { ActiveAccountService } from 'src/app/services/active-account.service';
import { SenddetailPage } from 'src/app/Modals/senddetail/senddetail.page';
import { EnterpinsendPage } from 'src/app/Modals/enterpinsend/enterpinsend.page';
import { TrxstatusPage } from 'src/app/Modals/trxstatus/trxstatus.page';


@Component({
  selector: 'app-sendcoin',
  templateUrl: './sendcoin.page.html',
  styleUrls: ['./sendcoin.page.scss'],
})
export class SendcoinPage implements OnInit {

  status: any;
  activeAccount: any;
  account: any;
  recipient: any;
  amount: number;
  fee: any;

  allFees = [];

  isAmountValid = true;
  isFeeValid = true;
  isRecipientValid = true;
  isBalanceValid = true;
  accountName = '';
  recipientMsg = '';
  amountMsg = '';
  allAccounts = [];
  errorMsg: string;

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;

  constructor(
    private storage: Storage,
    @Inject('nacl.sign') private sign: any,
    private transactionService: TransactionService,
    private toastController: ToastController,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

}
