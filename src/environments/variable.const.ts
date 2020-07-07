import { Currency } from 'src/app/Interfaces/currency';

export const COIN_CODE = 'ZBC';
export const SALT_PASSPHRASE = 'p4ssphr4se';
export const STORAGE_ACTIVE_CURRENCY = 'active_currency';
export const STORAGE_ACTIVE_NETWORK_IDX = 'active_network_idx';
export const STORAGE_CURRENCY_RATES = 'currency_rates';
export const STORAGE_CURRENCY_RATE = 'rate';
export const STORAGE_ADDRESS_BOOK = 'address_book';
export const STORAGE_ALL_ACCOUNTS = 'all_accounts';
export const STORAGE_ALL_MULTISIG_ACCOUNTS = 'all_multisig_accounts';
export const STORAGE_CURRENT_ACCOUNT = 'curr_account';
export const STORAGE_MAIN_ACCOUNT = 'main_account';
export const STORAGE_ENC_MASTER_SEED = 'enc_master_seed';
export const STORAGE_ENC_PASSPHRASE_SEED = 'enc_passphrase_seed';
export const STORAGE_ESCROW_WAITING_LIST = 'escrow_waiting_list';
export const STORAGE_MULTISIG_DRAFTS = 'MULTISIG_DRAFTS';
export const STORAGE_ACTIVE_THEME = 'storage_active_theme';
export const DEFAULT_THEME = 'zoobc';
export const FIREBASE_ADDRESS_BOOK = 'address_book_backup';
export const FIREBASE_DEVICES = 'devices';
export const FIREBASE_CHAT = 'chats';
export const FIREBASE_CHAT_USER = 'chatusers';
export const ADDRESS_LENGTH = 44;
export const TRANSACTION_TYPE = Buffer.from([1, 0, 0, 0]);
export const TRANSACTION_MINIMUM_FEE = 0.01;
export const TRANSACTION_VERSION = Buffer.from([1]);
export const FOR_SENDER = 'sender';
export const FOR_RECIPIENT = 'recipient';
export const FOR_ACCOUNT = 'account';
export const MODE_EDIT = 'edit';
export const MODE_NEW = 'new';
export const EMPTY_STRING = '';
export const CONST_DEFAULT_CURRENCY = 'USD';
export const CONST_UNKNOWN_NAME = 'Unknown';
export const BLOCKCHAIN_BLOG_URL = 'https://blogchainzoo.com';

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
  },
  {
    name: 'BCZoo',
    value: 'bcz'
  },
  {
    name: 'Day',
    value: 'day'
  },
  {
    name: 'Night',
    value: 'night'
  }
];
export const SELECTED_THEME = 'card';
export const LANGUAGES = [
  {
    country: 'العربية',
    code: 'ar',
    img: 'assets/images/lang/ar.png'
  }
  ,
  {
    country: 'ελληνικά',
    code: 'el',
    img: 'assets/images/lang/el.png'
  },
  {
    country: 'Dansk',
    code: 'da',
    img: 'assets/images/lang/da.png'
  },
  {
    country: 'Deutsche',
    code: 'de',
    img: 'assets/images/lang/de.png'
  },
  {
    country: 'English',
    code: 'en',
    img: 'assets/images/lang/en.png'
  },
  {
    country: 'Español',
    code: 'es',
    img: 'assets/images/lang/es.png'
  },
  {
    country: 'Suomi',
    code: 'fi',
    img: 'assets/images/lang/fi.png'
  },
  {
    country: 'Français',
    code: 'fr',
    img: 'assets/images/lang/fr.png'
  },
  {
    country: 'हिन्दी',
    code: 'hi',
    img: 'assets/images/lang/hi.png'
  },
  {
    country: 'Hebrew',
    code: 'he',
    img: 'assets/images/lang/he.png'
  },
  {
    country: 'Hrvatski',
    code: 'hr',
    img: 'assets/images/lang/hr.png'
  },
  {
    country: 'Hungarian',
    code: 'hu',
    img: 'assets/images/lang/hu.png'
  },
  {
    country: 'Indonesia',
    code: 'id',
    img: 'assets/images/lang/id.png'
  },
  {
    country: 'Italiano',
    code: 'it',
    img: 'assets/images/lang/it.png'
  },
  {
    country: '한국어',
    code: 'ko',
    img: 'assets/images/lang/ko.png'
  },
  {
    country: 'Malay',
    code: 'ms',
    img: 'assets/images/lang/ms.png'
  },
  {
    country: 'Nederlands',
    code: 'nl',
    img: 'assets/images/lang/nl.png'
  },
  {
    country: 'Norwegian',
    code: 'no',
    img: 'assets/images/lang/no.png'
  },
  {
    country: 'Português',
    code: 'pt',
    img: 'assets/images/lang/pt.png'
  },
  {
    country: '日本語',
    code: 'ja',
    img: 'assets/images/lang/ja.png'
  },
  {
    country: 'Русский',
    code: 'ru',
    img: 'assets/images/lang/ru.png'
  },
  {
    country: 'Slovenčina',
    code: 'sl',
    img: 'assets/images/lang/sl.png'
  },
  {
    country: 'Swedish',
    code: 'sv',
    img: 'assets/images/lang/sv.png'
  },
  {
    country: 'Polskie',
    code: 'pl',
    img: 'assets/images/lang/pl.png'
  },
  {
    country: 'Limba română',
    code: 'ro',
    img: 'assets/images/lang/ro.png'
  },
  {
    country: '中文(简体)',
    code: 'zh',
    img: 'assets/images/lang/zh.png'
  },
  {
    country: 'ไทย',
    code: 'th',
    img: 'assets/images/lang/th.png'
  },
  {
    country: 'Tiếng Việt',
    code: 'vi',
    img: 'assets/images/lang/vi.png'
  },
  {
    country: 'Türkçe',
    code: 'tr',
    img: 'assets/images/lang/tr.png'
  }
];

export const NETWORK_LIST = [
  // {
  //   name: 'Staging',
  //   host: 'https://n0.demo.proofofparticipation.network'
  // },
  // {
  //   name: 'Dev 1: ',
  //   host: 'http://172.104.34.10:8002'
  // },
  // {
  //   name: 'Dev 2',
  //   host: 'http://45.79.39.58:8002'
  // },
  // {
  //   name: 'Dev 3',
  //   host: 'http://85.90.246.90:8002'
  // }
    {
      host: '//n1.alpha.proofofparticipation.network:8080',
      default: true,
      name: 'Alpha Testnet'
    },
    {
      host: '//85.90.246.90:8002',
      default: true,
      name: 'Demo Testnet 1'
    },
    {
      host: '//45.79.39.58:8002',
      default: true,
      name: 'Demo Testnet 2'
    }
];

export const TRX_FEE_LIST = [{
    name: 'Slow',
    fee: TRANSACTION_MINIMUM_FEE * 2
  },
  {
    name: 'Average',
    fee: TRANSACTION_MINIMUM_FEE * 4
  },
  {
    name: 'Fast',
    fee: TRANSACTION_MINIMUM_FEE * 6
}];

export const CURRENCY_LIST = {
  AED: 'United Arab Emirates Dirham', AFN: 'Afghan Afghani',
  ALL: 'Albanian Lek', AMD: 'Armenian Dram', ANG: 'Netherlands Antillean Guilder',
  AOA: 'Angolan Kwanza', ARS: 'Argentine Peso', AUD: 'Australian Dollar',
  AWG: 'Aruban Florin', AZN: 'Azerbaijani Manat', BAM: 'Bosnia-Herzegovina Convertible Mark',
  BBD: 'Barbadian Dollar', BDT: 'Bangladeshi Taka', BGN: 'Bulgarian Lev',
  BHD: 'Bahraini Dinar', BIF: 'Burundian Franc', BMD: 'Bermudan Dollar',
  BND: 'Brunei Dollar', BOB: 'Bolivian Boliviano', BRL: 'Brazilian Real',
  BSD: 'Bahamian Dollar', BTC: 'Bitcoin', BTN: 'Bhutanese Ngultrum',
  BWP: 'Botswanan Pula', BYN: 'Belarusian Ruble', BZD: 'Belize Dollar',
  CAD: 'Canadian Dollar', CDF: 'Congolese Franc', CHF: 'Swiss Franc',
  CLF: 'Chilean Unit of Account (UF)', CLP: 'Chilean Peso',
  CNH: 'Chinese Yuan (Offshore)', CNY: 'Chinese Yuan', COP: 'Colombian Peso',
  CRC: 'Costa Rican Colón', CUC: 'Cuban Convertible Peso', CUP: 'Cuban Peso',
  CVE: 'Cape Verdean Escudo', CZK: 'Czech Republic Koruna', DJF: 'Djiboutian Franc',
  DKK: 'Danish Krone', DOP: 'Dominican Peso', DZD: 'Algerian Dinar',
  EGP: 'Egyptian Pound', ERN: 'Eritrean Nakfa', ETB: 'Ethiopian Birr',
  EUR: 'Euro', FJD: 'Fijian Dollar', FKP: 'Falkland Islands Pound',
  GBP: 'British Pound Sterling', GEL: 'Georgian Lari', GGP: 'Guernsey Pound',
  GHS: 'Ghanaian Cedi', GIP: 'Gibraltar Pound', GMD: 'Gambian Dalasi',
  GNF: 'Guinean Franc', GTQ: 'Guatemalan Quetzal', GYD: 'Guyanaese Dollar',
  HKD: 'Hong Kong Dollar', HNL: 'Honduran Lempira', HRK: 'Croatian Kuna',
  HTG: 'Haitian Gourde', HUF: 'Hungarian Forint', IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Sheqel', IMP: 'Manx pound', INR: 'Indian Rupee',
  IQD: 'Iraqi Dinar', IRR: 'Iranian Rial', ISK: 'Icelandic Króna',
  JEP: 'Jersey Pound', JMD: 'Jamaican Dollar', JOD: 'Jordanian Dinar',
  JPY: 'Japanese Yen', KES: 'Kenyan Shilling', KGS: 'Kyrgystani Som',
  KHR: 'Cambodian Riel', KMF: 'Comorian Franc', KPW: 'North Korean Won',
  KRW: 'South Korean Won', KWD: 'Kuwaiti Dinar', KYD: 'Cayman Islands Dollar',
  KZT: 'Kazakhstani Tenge', LAK: 'Laotian Kip', LBP: 'Lebanese Pound',
  LKR: 'Sri Lankan Rupee', LRD: 'Liberian Dollar', LSL: 'Lesotho Loti',
  LYD: 'Libyan Dinar', MAD: 'Moroccan Dirham', MDL: 'Moldovan Leu',
  MGA: 'Malagasy Ariary', MKD: 'Macedonian Denar', MMK: 'Myanma Kyat',
  MNT: 'Mongolian Tugrik', MOP: 'Macanese Pataca',
  MRO: 'Mauritanian Ouguiya (pre-2018)', MRU: 'Mauritanian Ouguiya',
  MUR: 'Mauritian Rupee', MVR: 'Maldivian Rufiyaa', MWK: 'Malawian Kwacha',
  MXN: 'Mexican Peso', MYR: 'Malaysian Ringgit', MZN: 'Mozambican Metical',
  NAD: 'Namibian Dollar', NGN: 'Nigerian Naira', NIO: 'Nicaraguan Córdoba',
  NOK: 'Norwegian Krone', NPR: 'Nepalese Rupee', NZD: 'New Zealand Dollar',
  OMR: 'Omani Rial', PAB: 'Panamanian Balboa', PEN: 'Peruvian Nuevo Sol',
  PGK: 'Papua New Guinean Kina', PHP: 'Philippine Peso', PKR: 'Pakistani Rupee',
  PLN: 'Polish Zloty', PYG: 'Paraguayan Guarani', QAR: 'Qatari Rial',
  RON: 'Romanian Leu', RSD: 'Serbian Dinar', RUB: 'Russian Ruble',
  RWF: 'Rwandan Franc', SAR: 'Saudi Riyal', SBD: 'Solomon Islands Dollar',
  SCR: 'Seychellois Rupee', SDG: 'Sudanese Pound', SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar', SHP: 'Saint Helena Pound', SLL: 'Sierra Leonean Leone',
  SOS: 'Somali Shilling', SRD: 'Surinamese Dollar', SSP: 'South Sudanese Pound',
  STD: 'São Tomé and Príncipe Dobra (pre-2018)', STN: 'São Tomé and Príncipe Dobra',
  SVC: 'Salvadoran Colón', SYP: 'Syrian Pound', SZL: 'Swazi Lilangeni',
  THB: 'Thai Baht', TJS: 'Tajikistani Somoni', TMT: 'Turkmenistani Manat',
  TND: 'Tunisian Dinar', TOP: 'Tongan Paanga', TRY: 'Turkish Lira',
  TTD: 'Trinidad and Tobago Dollar', TWD: 'New Taiwan Dollar',
  TZS: 'Tanzanian Shilling', UAH: 'Ukrainian Hryvnia', UGX: 'Ugandan Shilling',
  USD: 'United States Dollar', UYU: 'Uruguayan Peso', UZS: 'Uzbekistan Som',
  VEF: 'Venezuelan Bolívar Fuerte(Old)', VES: 'Venezuelan Bolívar Soberano',
  VND: 'Vietnamese Dong', VUV: 'Vanuatu Vatu', WST: 'Samoan Tala',
  XAF: 'CFA Franc BEAC', XAG: 'Silver Ounce', XAU: 'Gold Ounce',
  XCD: 'East Caribbean Dollar', XDR: 'Special Drawing Rights',
  XOF: 'CFA Franc BCEAO', XPD: 'Palladium Ounce', XPF: 'CFP Franc',
  XPT: 'Platinum Ounce', YER: 'Yemeni Rial', ZAR: 'South African Rand',
  ZMW: 'Zambian Kwacha', ZWL: 'Zimbabwean Dollar'
};


export const CURRENCY_RATE_LIST = {
  disclaimer: 'Usage subject to terms: https://openexchangerates.org/terms',
  license: 'https://openexchangerates.org/license',
  timestamp: 1575255600,
  base: CONST_DEFAULT_CURRENCY,
  rates: {
    AED: 3.673,
    AFN: 78.38653,
    ALL: 111.319805,
    AMD: 476.957038,
    ANG: 1.716256,
    AOA: 491.248,
    ARS: 59.660266,
    AUD: 1.476657,
    AWG: 1.8,
    AZN: 1.7025,
    BAM: 1.77472,
    BBD: 2,
    BDT: 84.708963,
    BGN: 1.775,
    BHD: 0.376234,
    BIF: 1871.660895,
    BMD: 1,
    BND: 1.364096,
    BOB: 6.899868,
    BRL: 4.2366,
    BSD: 1,
    BTC: 0.000134907736,
    BTN: 71.58232,
    BWP: 10.833991,
    BYN: 2.106529,
    BZD: 2.011252,
    CAD: 1.328904,
    CDF: 1663.84328,
    CHF: 1.000216,
    CLF: 0.024,
    CLP: 859.8,
    CNH: 7.030225,
    CNY: 7.0297,
    COP: 3505.545891,
    CRC: 561.319406,
    CUC: 1,
    CUP: 25.75,
    CVE: 101.025,
    CZK: 23.189,
    DJF: 178,
    DKK: 6.782305,
    DOP: 52.719682,
    DZD: 120.2471,
    EGP: 16.08758,
    ERN: 14.999786,
    ETB: 30.587941,
    EUR: 0.907665,
    FJD: 2.1911,
    FKP: 0.774407,
    GBP: 0.774407,
    GEL: 2.965,
    GGP: 0.774407,
    GHS: 5.60764,
    GIP: 0.774407,
    GMD: 51.18,
    GNF: 9513.685731,
    GTQ: 7.683136,
    GYD: 208.756401,
    HKD: 7.829152,
    HNL: 24.568343,
    HRK: 6.7494,
    HTG: 96.927337,
    HUF: 303.803481,
    IDR: 14079.197109,
    ILS: 3.470876,
    IMP: 0.774407,
    INR: 71.762498,
    IQD: 1191.1977,
    IRR: 42105,
    ISK: 121.370027,
    JEP: 0.774407,
    JMD: 140.55937,
    JOD: 0.7095,
    JPY: 109.693,
    KES: 102.58,
    KGS: 69.670193,
    KHR: 4067.331462,
    KMF: 447.249823,
    KPW: 900,
    KRW: 1178.3875,
    KWD: 0.30416,
    KYD: 0.831541,
    KZT: 385.726525,
    LAK: 8846.021787,
    LBP: 1508.916813,
    LKR: 180.528551,
    LRD: 191.900029,
    LSL: 14.610952,
    LYD: 1.404383,
    MAD: 9.648201,
    MDL: 17.456648,
    MGA: 3675.158796,
    MKD: 55.841382,
    MMK: 1504.19524,
    MNT: 2690.319986,
    MOP: 8.043464,
    MRO: 357,
    MRU: 37.400122,
    MUR: 36.849999,
    MVR: 15.41,
    MWK: 731.145242,
    MXN: 19.5418,
    MYR: 4.1785,
    MZN: 64.089997,
    NAD: 14.610952,
    NGN: 361.952551,
    NIO: 33.663196,
    NOK: 9.216045,
    NPR: 114.52162,
    NZD: 1.552611,
    OMR: 0.384974,
    PAB: 1,
    PEN: 3.387596,
    PGK: 3.438554,
    PHP: 50.861894,
    PKR: 154.904725,
    PLN: 3.912751,
    PYG: 6441.964406,
    QAR: 3.633048,
    RON: 4.3402,
    RSD: 106.72,
    RUB: 64.2955,
    RWF: 931.310197,
    SAR: 3.75,
    SBD: 8.254337,
    SCR: 13.69952,
    SDG: 45.007394,
    SEK: 9.569525,
    SGD: 1.367975,
    SHP: 0.774407,
    SLL: 7438.043346,
    SOS: 577.196793,
    SRD: 7.458,
    SSP: 130.26,
    STD: 21560.79,
    STN: 22.35,
    SVC: 8.731001,
    SYP: 515.060169,
    SZL: 14.611406,
    THB: 30.218915,
    TJS: 9.668799,
    TMT: 3.51,
    TND: 2.846,
    TOP: 2.321129,
    TRY: 5.750741,
    TTD: 6.74189,
    TWD: 30.49455,
    TZS: 2296.95219,
    UAH: 23.902274,
    UGX: 3691.8494,
    USD: 1,
    UYU: 38.015089,
    UZS: 9489.142571,
    VEF: 248487.642241,
    VES: 22704,
    VND: 23138.02234,
    VUV: 115.955499,
    WST: 2.667352,
    XAF: 595.389296,
    XAG: 0.05902325,
    XAU: 0.00068504,
    XCD: 2.70255,
    XDR: 0.728343,
    XOF: 595.389296,
    XPD: 0.00054247,
    XPF: 108.313261,
    XPT: 0.00111421,
    YER: 250.400036,
    ZAR: 14.6357,
    ZMW: 14.62293,
    ZWL: 322.000001
  }
};
