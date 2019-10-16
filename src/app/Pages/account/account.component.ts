import { Component, OnInit } from "@angular/core";
import { NavController, ModalController, IonItemSliding } from "@ionic/angular";
import { ModalFormAccountComponent } from "./modal-form-account/modal-form-account.component";
import { AccountService } from "src/app/Services/account.service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Subject } from "rxjs";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  constructor(
    private navtrl: NavController,
    private modalController: ModalController,
    private accountSrv: AccountService,
    //private activeAccountSrv: ActiveAccountService,
    private socialSharing: SocialSharing
  ) {}

  //items: Account[] = [];

  onSubmit: Subject<any>;

  items: any[] = [];

  async ngOnInit() {
    this.items = await this.accountSrv.getAll();
  }

  share(address) {
    this.socialSharing.share(address);
  }

  itemClicked(index) {
    const account = this.items[index];

    this.accountSrv.setActiveAccount(account).then(() => {
      this.navtrl.pop();
    });
  }

  createNewAccount() {
    this.onSubmit = new Subject<any>();

    this.onSubmit.subscribe(acc => {
      this.items.push(acc);
    });

    this.presentModal(null);
  }

  editAccount(index, slidingItem: IonItemSliding) {
    this.onSubmit = new Subject<any>();

    this.onSubmit.subscribe(acc => {
      this.items[index].name = acc.name;
      slidingItem.close();
    });

    const item = this.items[index];

    const props = {
      title: "Edit Account",
      type: "edit",
      item
    };
    this.presentModal(props);
  }

  async presentModal(componentProps) {
    const conf: any = {
      component: ModalFormAccountComponent
    };

    if (componentProps) {
      conf.componentProps = componentProps;
    }

    const modal = await this.modalController.create(conf);

    modal.onDidDismiss().then((returnVal: any) => {
      const account = returnVal.data.account;

      this.onSubmit.next(account);
      this.onSubmit.unsubscribe();
    });

    return await modal.present();
  }
}
