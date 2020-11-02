import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { File } from '@ionic-native/file/ngx';
import { UtilService } from 'src/app/Services/util.service';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { FOR_RECIPIENT, FOR_APPROVER, FOR_PARTICIPANT, FOR_SIGNBY } from 'src/environments/variable.const';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss']
})
export class AddressBookPage implements OnInit, OnDestroy {
  addresses = [];
  navigationSubscription: any;
  forWhat: string;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private utilService: UtilService,
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private platform: Platform
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getAllAddress();
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      } else {
        this.forWhat = null;
      }
    });
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  copyAddress(index: string | number) {
    const val = this.addresses[index];
    this.utilService.copyToClipboard(val.address);
  }

  selectAddress(address: any) {
    if (!this.forWhat) {
      return;
    }
    if (this.forWhat === FOR_RECIPIENT) {
      this.addressBookSrv.setRecipientAddress(address);
    } else if (this.forWhat === FOR_APPROVER) {
      this.addressBookSrv.setApproverAddress(address);
    } else if (this.forWhat === FOR_PARTICIPANT) {
      this.addressBookSrv.setParticipant(address);
    } else if (this.forWhat === FOR_SIGNBY) {
      this.addressBookSrv.setSignBy(address);
    }
    this.navCtrl.pop();
  }

  editAddress(index: number) {
    this.navCtrl.navigateForward('/address-book/' + index);
  }

  async deleteAddress(index: number) {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes',
          handler: () => {
            this.addresses.splice(index, 1);
            this.addressBookSrv.update(this.addresses);
          }
        }
      ]
    });

    await alert.present();
  }

  createNewAddress() {
    this.router.navigate(['/address-book/add']);
  }

  async ExportContacts() {

    const theJSON = JSON.stringify(this.addresses);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    const pathFile = await this.getDownloadPath();

    const fileName = this.getFileName();
    await this.file.createFile(pathFile, fileName, true);
    await this.file.writeFile(pathFile, fileName, blob, {
      replace: true,
      append: false
    });
    alert('File saved in Download folder with name: ' + fileName);

  }

  private getFileName() {
    const currentDatetime = new Date();
    const formattedDate =
      currentDatetime.getDate() +
      '-' +
      (currentDatetime.getMonth() + 1) +
      '-' +
      currentDatetime.getFullYear() +
      '-' +
      currentDatetime.getHours() +
      '-' +
      currentDatetime.getMinutes() +
      '-' +
      currentDatetime.getSeconds();

    return 'Contact-list-' + formattedDate + '.json';
  }

  async getDownloadPath() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }

    // To be able to save files on Android, we first need to ask the user for permission.
    // We do not let the download proceed until they grant access
    await this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(result => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      });

    return this.file.externalRootDirectory + '/Download/';
  }

}
