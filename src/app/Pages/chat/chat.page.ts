import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Services/auth-service';
import { AddressBookService } from 'src/app/Services/address-book.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public chatData: Array<any>;
  segmentTab: any;
  addresses = [];
  account: Account;
  constructor(private router: Router,
              private addressBookSrv: AddressBookService,
              private accountService: AccountService) {

      this.accountService.accountSubject.subscribe(() => {
          this.loadAccount();
      });
  }

  async loadAccount() {
    this.account = await this.accountService.getCurrAccount();
  }


  segmentChanged(event: any) {
    this.segmentTab = event.detail.value;
    console.log(this.segmentTab);
  }

  ngOnInit() {
    this.segmentTab = 'Chat';
    this.loadAccount();
    this.getAllAddress();

    this.chatData = [{
      name: 'Jovenica',
      address: 'xvbvn1',
      image: '../../assets/chat/user.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'online',
      count: '2',
      time: '2 min ago'

    }, {
      name: 'Oliver',
      address: 'xvbvn2',
      image: ' ../../assets/chat/user3.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      badge: '4',
      sendTime: '18:34',
      group: true

    }, {
      name: 'George',
      address: 'xvbvn3',
      image: ' ../../assets/chat/user4.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      count: '2',
      sendTime: '18:30',
      broadcast: true

    }, {
      name: 'Harry',
      address: 'xvbvn4',
      image: ' ../../assets/chat/user1.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'online',
      badge: '6',
      sendTime: '17:55'
    }, {
      name: 'Jack',
      address: 'xvbvn5',
      image: ' ../../assets/chat/user.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      sendTime: '17:55'
    }, {
      name: 'Jacob',
      address: 'xvbvn6',
      image: ' ../../assets/chat/user3.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      count: '1',
      sendTime: '17:50'
    }, {
      name: 'Noah',
      address: 'xvbvn7',
      image: ' ../../assets/chat/user2.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      sendTime: '17:40'
    }, {
      name: 'Charlie',
      address: 'xvbvn8',
      image: ' ../../assets/chat/user4.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'online',
      count: '6',
      badge: '8',
      sendTime: '17:40'
    }, {
      name: 'Logan',
      address: 'xvbvn9',
      image: ' ../../assets/chat/user.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      badge: '8',
      sendTime: '17:40'
    }, {
      name: 'Harrison',
      address: 'xvbvn10',
      image: ' ../../assets/chat/user2.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      sendTime: '17:40'
    }, {
      name: 'Sebastian',
      address: 'xvbvn11',
      image: ' ../../assets/chat/user1.jpeg',
      description: '  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'online',
      sendTime: '17:40'
    }, {
      name: 'Zachary',
      address: 'xvbvn12',
      image: ' ../../assets/chat/user4.jpeg',
      description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt. ',
      status: 'offline',
      sendTime: '17:40'
    }
    ];


    console.log('---- All address in chat---- :', this.addresses);

  }


  showAction(idx: number){

  }

  showSession(idx: number) {

    const chat = this.chatData[idx];
    console.log('... di session ', chat);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        sender: this.account.address,
        name: chat.name,
        address: chat.address,
        index: idx
      }
    };
    this.router.navigate(['/chat-session'], navigationExtras);

  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

}
