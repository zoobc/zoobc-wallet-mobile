// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.


import { Currency } from 'src/app/Interfaces/currency';
export const UNIQUE_DB_ID = '0004';
export const COIN_CODE = 'ZBC';
export const SALT_PASSPHRASE = '';
export const STORAGE_ACTIVE_CURRENCY = 'strg_active_currency' + '_' + UNIQUE_DB_ID;
export const STORAGE_ACTIVE_NETWORK_GROUP = 'strg_current_network_group' + '_' + UNIQUE_DB_ID;
export const STORAGE_ALL_NETWORKS_GROUP = 'strg_all_network_group' + '_' + UNIQUE_DB_ID;
export const STORAGE_CURRENCY_RATES = 'strg_currency_rates' + '_' + UNIQUE_DB_ID;
export const STORAGE_CURRENCY_RATE = 'strg_rate' + '_' + UNIQUE_DB_ID;
export const STORAGE_ADDRESS_BOOK = 'strg_address_book' + '_' + UNIQUE_DB_ID;
export const STORAGE_ALL_ACCOUNTS = 'strg_all_accounts' + '_' + UNIQUE_DB_ID;
export const STORAGE_ALL_MULTISIG_ACCOUNTS = 'strg_all_multisig_accounts' + '_' + UNIQUE_DB_ID;
export const STORAGE_CURRENT_ACCOUNT = 'strg_curr_account2' + '_' + UNIQUE_DB_ID;
export const STORAGE_CURRENT_ACCOUNT_MULTISIG = 'strg_curr_account_multisig' + '_' + UNIQUE_DB_ID;
export const STORAGE_MAIN_ACCOUNT = 'strg_main_account' + '_' + UNIQUE_DB_ID;
export const STORAGE_ENC_PASSPHRASE_SEED = 'strg_encrypted_passphrase_seed' + '_' + UNIQUE_DB_ID;
export const STORAGE_ESCROW_WAITING_LIST = 'strg_escrow_waiting_list' + '_' + UNIQUE_DB_ID;
export const STORAGE_MULTISIG_DRAFTS = 'strg_multisig_drafts' + '_' + UNIQUE_DB_ID;
export const STORAGE_ACTIVE_THEME = 'strg_storage_active_theme' + '_' + UNIQUE_DB_ID;
export const DEFAULT_THEME = 'zoobc';
export const ADDRESS_LENGTH = 44;
export const TRANSACTION_TYPE = Buffer.from([1, 0, 0, 0]);
export const TRANSACTION_MINIMUM_FEE = 0.01;
export const TRANSACTION_VERSION = Buffer.from([1]);
export const FOR_SENDER = 'sender';
export const FOR_PARTICIPANT = 'participant';
export const FOR_SIGNBY = 'signby';
export const FOR_RECIPIENT = 'recipient';
export const FOR_APPROVER = 'approver';
export const FOR_ACCOUNT = 'account';
export const MODE_EDIT = 'edit';
export const MODE_NEW = 'new';
export const FROM_MSIG = 'msig';
export const EMPTY_STRING = '';
export const CONST_DEFAULT_CURRENCY = 'USD';
export const CONST_UNKNOWN_NAME = 'Unknown';
export const BLOCKCHAIN_BLOG_URL = 'https://blogchainzoo.com';
export const ACC_TYPE_MULTISIG = 'multisig';
export const ACC_TYPE_NORMAL = 'normal';
export const CONST_DEFAULT_RATE: Currency = {
  name: CONST_DEFAULT_CURRENCY,
  value: 1,
};
export const NUMBER_OF_RECORD_IN_TRANSACTIONS = 20;
export const CONST_HEX = 'hex';

// Language
export const SELECTED_LANGUAGE = 'selected_language';

export const THEME_OPTIONS  = [
  {
  name: 'ZooBC',
  value: 'zoobc'
  }
];

export const SELECTED_THEME = 'card';
export const LANGUAGES = [
  {
    country: 'العربية',
    code: 'ar',
    img: 'assets/images/lang/ar.png'
  },
  {
    country: 'English',
    code: 'en',
    img: 'assets/images/lang/en.png'
  },
  {
    country: 'Indonesia',
    code: 'id',
    img: 'assets/images/lang/id.png'
  }
];

export const CURRENCY_LIST = {
  USD: 'United States Dollar'
};

export const NETWORK_LIST = [
  {
    label: 'MainNet',
    wkps: [
      'http://n0.beta.proofofparticipation.network:7001',
      'http://n1.beta.proofofparticipation.network:7001',
      'http://n2.beta.proofofparticipation.network:7001',
      'http://n3.beta.proofofparticipation.network:7001',
      'http://n4.beta.proofofparticipation.network:7001'
    ]
  },
  {
    label: 'ExperiNet',
    wkps: [
      'http://n0.beta.proofofparticipation.network:7001',
      'http://n1.beta.proofofparticipation.network:7001',
      'http://n2.beta.proofofparticipation.network:7001',
      'http://n3.beta.proofofparticipation.network:7001',
      'http://n4.beta.proofofparticipation.network:7001'
    ]
  },
  {
    label: 'Alpha Net',
    wkps: [
      'http://n0.alpha.proofofparticipation.network:7001',
      'http://n1.alpha.proofofparticipation.network:7001',
      'http://n2.alpha.proofofparticipation.network:7001',
      'http://n3.alpha.proofofparticipation.network:7001',
      'http://n4.alpha.proofofparticipation.network:7001'
    ]
  },
  {
    label: 'Dev Net',
    wkps: [
      'http://172.104.62.181:7001'
    ]
  }
];

