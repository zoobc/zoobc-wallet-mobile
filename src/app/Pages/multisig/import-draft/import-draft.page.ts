import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { AccountService } from 'src/app/Services/account.service';
import { MultisigService } from 'src/app/Services/multisig.service';
import { UtilService } from 'src/app/Services/util.service';
import { isZBCAddressValid } from 'zbc-sdk';

@Component({
  selector: 'app-import-draft',
  templateUrl: './import-draft.page.html',
  styleUrls: ['./import-draft.page.scss'],
})
export class ImportDraftPage implements OnInit {
  account: Account;
  isMultiSignature: boolean;
  multiSigDrafts: MultiSigDraft[];

  constructor(private utilSrv: UtilService,
              private modalController: ModalController,
              private multisigServ: MultisigService,
              private accountSrv: AccountService,
              private alertController: AlertController) { }

  async ngOnInit() {
    await this.getMultiSigDraft();
    // this.goNextStep();
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).generatedSender !== undefined) {
      return isZBCAddressValid((file as MultiSigDraft).generatedSender);
    }
    return false;
  }

  public async uploadFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        const fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        if (!validation) {
          const message = 'You imported the wrong file';
          this.presentAlert('Opps...', message);
        } else {
          this.multisigServ.update(fileResult);
          const listdraft = await this.multisigServ.getDrafts();
          const checkExistDraft = listdraft.some(
            res => res.id === fileResult.id
          );

          if (checkExistDraft === true) {
            const message = 'There is same id in your draft';
            this.presentAlert('Opps...', message);
          } else {
            this.multisigServ.saveDraft();
            this.getMultiSigDraft();
            const subMessage = 'Your Draft has been saved';
            this.presentAlert('Success', subMessage);
          }
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        const message = 'An error occurred while processing your request';
        this.utilSrv.showConfirmation('Opps...', message, false, null);
      };
    }
  }

  async presentAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  async getMultiSigDraft() {
    const currAccount = await this.accountSrv.getCurrAccount();
    this.account = currAccount;

    this.isMultiSignature = this.account.type !== 'multisig' ? false : true;

    const drafts = await this.multisigServ.getDrafts();
    console.log('=== Drfts: ', drafts);
    if (drafts) {
      this.multiSigDrafts = drafts;

    }
  }

  close() {
    this.modalController.dismiss(0);
  }
}
