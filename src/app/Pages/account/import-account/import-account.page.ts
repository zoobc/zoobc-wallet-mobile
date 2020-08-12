import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.page.html',
  styleUrls: ['./import-account.page.scss'],
})
export class ImportAccountPage implements OnInit {

  constructor(
    private accountService: AccountService,
    private modalController: ModalController) { }

  ngOnInit() {
  }

  async close(status: number) {
    await this.modalController.dismiss(status);
  }

  public uploadFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        let fileResult;
        try {
          fileResult = JSON.parse(fileReader.result.toString());
        } catch {
          alert('File not compatible1');
          return;
        }
        if (!this.isSavedAccount(fileResult)) {
          alert('You imported the wrong file');
          return;
        }
        const accountSave: Account = fileResult;
        console.log('== accountSave: ', accountSave);

        const allAcc  = await this.accountService.allAccount('multisig');
        const idx = allAcc.findIndex(acc => acc.address === accountSave.address);
        if (idx >= 0) {
          alert('Account with that address is already exist');
          return;
        }

        try {
          await this.accountService.addAccount(accountSave).then(() => {
              this.close(1);
          });
        } catch {
          alert ('Error when importing account, please try again later!');
        } finally {
        }
      };
    }
  }

  isSavedAccount(obj: any): obj is Account {
    if ((obj as Account).type) { return true; }
    return false;
  }

}
