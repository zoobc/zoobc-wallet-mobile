export const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';
export const ACTIVE_CURRENCY = 'ACTIVE_CURRENCY';
export const CURRENCY_RATE_STORAGE = 'rate';
export const OPENEXCHANGE_RATES_STORAGE = 'openexchange_rates';
export const TRX_FEES_STORAGE = 'transaction_fees_in_firebase';
export const RATES = 'RATES';


// Language
export const SELECTED_LANGUAGE = 'SELECTED_LANGUAGE';
export const SELECTED_NODE = 'NET_SELECTED_NODE';

export const NETWORK_LIST = [
  {
    name: "Demo",
    domain: '172.104.47.168:8001'
  },
  {
    name: "Alpha Testnet",
    domain: 'n0.alpha.proofofparticipation.network:8080'
  },
  {
    name: "Local Testnet",
    domain: '192.168.20.243:7001'
  }
];


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
