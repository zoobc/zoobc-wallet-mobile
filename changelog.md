## Version 0.2.10-Beta
### 28 December 2020

* New UI Design.
* Blockchain Object.
* More options on multisig: send money, setup data account, remove data account, escrow approval.
* Add Step indicator on Multisig Send Money.
* Change ui on send transaction on multisig.

### 16 October 2020

* Fixing multisig Sign By when send money.
* Integrating Crypto News on dashboard.
* Add news page, news from cryptocompare API.
* Modify Themes.
* Fixing translation on some pages.
* Fixing account list when do switching account hide import/scan button.

### 9 October 2020
* Fixing bug Send Money.
* Fixing refresh indicator on dashboard.
* Fixing translation on some page.
* Fixing transaction detail.
* Add news part on dashboard.
* Update themes.
* Fixing bug on contact.
* Updae pin button color.
* Update SDK.

### 15 September 2020

* Fix beta node address that end with '/'.
* Give better message for multisig approval.
* Give better message for multisig escrow.
* Update SDK.

### 14 September 2020

* Add Beta Node.
* Fix Account error.
* Fix my task reload.
* Fix some bug that use shortAddress.

### 8 September 2020

* Update new SDK.
* Fix reveal passphrase error.
* Add ZooBC Testnet label if not using main network.
* New Block ID, Transaction ID, Address format.
* Fix transaction history.
* Update sidemenu item.

### 28 August 2020
* New coin number.
* Block height on my-task auto update.
* My task list for multi-signature.
* Transaction history with escrow and multisig badge.
* Fix send money on multisig.
* Fix multisig signer account.

### 24 August 2020
* QRCode Multisig Account on Account detail.
* Receive Page default amount is empty.
* New Design in some page.
* Add Scan multisig account on Account List.

### 12 August 2020
* New Desain of Confirmation seed passphrase.
* Chage label of pending transaction on transaction history.
* Add loading indicator when input pin.
* Export import multisig Account.
* Bug Fixing multisig transaction.
* Add screen that explain about seed phrase before genereate new wallet.

### 10 August 2020
* Commition fee info on my-task.
* Transaction list with commition fee info, if have escrow trx.
* Can select signer on multi-signature send money.

### 28 July 2020
* New Address Format, address start with ZBC.
* Restore accounts when open existing wallet.
* Export/import address book.

### 24 July 2020
* Approver with options: contact, accounts,QRCode.
* Better validation on all field in escrow transaction.
* Add sender name, recipient name, approver name on send detail confirmation if possible.
* Balance last time updated info on dashboard.
* Balance auto update each time open dashboard.

### 17 July 2020
Settings enhancement on language options and currency options

* Bug fixing on scan QRCode in address book.
* Bug fixing on account list.
* Bug fixing on contact list.
* Scanning QRCode from Dashboard.
* Can create multi-signature account.
* Sending Money with multi-signature account.
* Saving multi-signature draft.
* Export / import multi-signature draft.

### 27 May 2020

* Add transaction fee on Trasaction History.
* Modify sender/recipient name in Transaction history that get from account or contact list..
* Add balance information in Account list..
* Modify transfer/send screen, transaction fee options will depend on escrow timeout..
* Add blockheight information in transfer/send screen above of escrow timeout..
* Modify field escrow timeout and commition in transfer/send screen make label in right side more wide..

### 20 May 2020

* Apply theme for all PIN, pin background will use current theme/selected.
* On my task screen, button refresh change to pull to refresh..
* On transaction list paging use load more..
* On chat screen, now have to segment chats and contacts..
* Change default network to staging..
### 11 May 2020

* Change layout of dashboard.
* Add Chat feature, with one to one chat, push notif..
* Add Escrow feature in send money screen..
* Add Theme options, with three options: zoobc, day, night..
* Implement SDK for accessing zoobc node.

### 10 March 2020

* Add Cool App, Loan Calculator prototype..
* Add Cool app, ZooBC POS protorype..
* Add Push Notification support for Android version..
* Add Restore Address Book.
* Add Backup Address Book.
* Add Registration page for Backup.
* Add Login page for Backup.
* Bug fixing some feature that not work in old android version..

### 19 Desember 2019

* In Receive page, QR Code now with amount..
* Change storage from local storage to native storage for better performance.
* Modify dashboard UI design..
* Modify send coin UI design..
* Add left menu UI design.
* Modify splash screen..
* Modify generate passphrase, field number now inside text box as placeholder..
* Modify restore wallet, field number now inside text box as placeholder..
* Change copy to clipboard util, from browser clipboard to native clipboard..
* Add blog link in dashboard.
* Bug fixing on send coin..

### 07 Desember 2019

* Restore wallet or open existing wallet now with input field and number.
No need input one by one, copy your 24 passphrase and paste in one field,
it will automatically fill in rest of fields..
* Modify Send Coin Page for better UI.
* Fixing slow respon when input PIN, now better..
* Modify network selection, now have option: Demo (default), Alpha Network, Local Network. .
* Modify some feature to make it work well in iOS version..
* Change barcode scanner with scanner that have line and box square, it will more focus and fast when
scaning qrcode..

* Add aditional information in transaction detail: Transaction ID, Block ID, Height..

### 21 November 2019

* Add passphrase confirmation page..
* On the passphrase confirmation page, there are 2 fields that must be filled with words that match the
original passphrase. Three fields use different colors than other fields..
* Passphrase on create new wallet uses a new design..
* The result of copying a passphrase has been added the number in front of each word, so it's easy to find
and remember it when you need it to confirm the passphrase..

### 19 November 2019
* Bug fixing in currency selector in setting page.
* Adding 'last updated' information in currency selector in setting page.
* Modifying feedback form, now have error message.
* Modifying feedback form, now feedback form will back to previous page after submiting comment succesffull.
* Modifying feedback form now have confirmation modal after successfully sending comment..
* Set 1 zbc = 10 dollar..
* Modifying dashboard to have convertion to fiat money.
* Modifying send money form to have convertion to fiat money..
* Modifying send money confirmation to have convertion to fiat money.
* 
### 18 November 2019
* Change network to alpha network.
* Add node selector in left menu.
* Add feedback link to all secreen.
* 
### 14 November 2019

* Add doorbell as feedback services.
* Modify passphrase, now with row and column and have number..
* Change color schema simillar to explorer and web wallet.

### 8 November 2019

* Transaction Fees can configure dynamic from server side. .
* Move Currency selector to setting page..
* Move Language selector to setting page..
* Add My-Task page.
* Add Apps page.
* Add PIN in Reveal passphrase.

### 5 November 2019 18:00

* Change package to com.zoobc.mobilewallet.
* Change vesion to alpha and start version number to 0.1.0.
* Add Reveal Passphrase..
* Add Send between my accounts..
* Bug fixing Address book..
* Add Feedback form, and used firebase as backend..
* Add Currency rate..
* Add Change wallet when login..
* Modify send money screen, change transaction fee options as button..
* Review code: all harcoded string convert to Constants..
* Rearange project structure..

### 16 October 2019 18:00

* Add custom Fee in send money..
* Bug fixing in send money..
* Bug fixing in load more..

### 14 October 2019 18:00

* Add PIN confirmation in Open Existing Wallet..
* Add better validation in open existing wallet.
* Make full address on transaction detail.

### 11 October 2019 18:00
* Modify Confirm Transaction detail, make information more detail..
* Modify Pending Transaction detail, make information more detail..

### 10 October 2019 18:00
* Add back button and restore wallet and create wallet..
* Arange services from core to services folder, and refactor some page.ts..
* Delete some function that no more used by other pages..

### 9 October 2019 18:00
* Add Screen: Transaction confirmation screen..
* Add some translation in Transaction confirmation screen..
* Bug fix dashboard, balance not change after switch account..
* Fix some deprecated CSS..

### 7 October 2019 18:00
* Modify dashboard add sign arrow for transaction history.
* Add Load More on transaction hitory, will load 5 transactions each load..
* Fix some deprecated CSS..
* Change error msg when wrong PIN, use label instead toast..

### 4 October 2019 20:30
* Change PIN in send coin screen.
* Add barcode scanner when add address book..
* Add additional language: Spanish, Portugis ... .

### 3 October 2019 20:30
* Modify generate passphrase to make screen without scroll.
* Add additional language: Japan, China, Rusia .
* Modify send screen, allow select account as sender..

### 2 October 2019 13:30
* Modify initial Screen to make screen without scroll.
* Remove unwanted component in Add address book and add component..
* Add translation in some screen..

### 1 October 2019 15:25
* Add some language: Italian, French, Hindi, Arabic, Croatian, Malay, Thai, Indonesia .
* Can Edit Account Name in account list. Address not allowed to edit.
if account that edited is Active account then need refresh in dashboard...

### 30 September 2019 12:49
* Address book can add, edit delete.
* Swipe left in item to edit or delete.
* Transaction list with Name, if available in address book..
* Fix typo 'Recieve' change to 'Receive' in tab Receive..
* Better error msg if no internet or service down. For service down (node down) need wait arround 2 minutes.
.
### 27 September 2019 20:09
* Minimum transfer is 0.000001.
* Amount less than 0.000001 will round to 0.
* Error message in send form improved!.
* Add Balance in send form..
* Fix bug when switch account to new address..

### 27 September 2019
* Fix loading when service down.
* Add Pin with delete one character.
* Fix Timestamp in pending transaction detail.
* Allow copy address in address book.

### 26 September 2019
* Add loading indicator when service down error message.
* Allow copy address in account list.

### 25 September 2019
* Send Form, Add validation recipiont address length = 44, amount, transaction fee.