import { Injectable, Inject } from "@angular/core";

import { MnemonicsService } from "./mnemonics.service";
import { APP_CONFIG, AppConfig } from "../app-config.module";

import * as bip32 from "../../externals/bip32/types";
import { BIP32Interface } from "../../externals/bip32/types";
export { BIP32Interface } from "../../externals/bip32/types";

export const coins: Array<CoinInterface> = [
  {
    name: "AC - Asiacoin",
    network: "asiacoin",
    coinValue: 51
  },
  {
    name: "ACC - Adcoin",
    network: "adcoin",
    coinValue: 161
  },
  {
    name: "AUR - Auroracoin",
    network: "auroracoin",
    coinValue: 85
  },
  {
    name: "AXE - Axe",
    network: "axe",
    coinValue: 4242
  },
  {
    name: "ANON - ANON",
    network: "anon",
    coinValue: 220
  },
  {
    name: "BOLI - Bolivarcoin",
    network: "bolivarcoin",
    coinValue: 278
  },
  {
    name: "BCA - Bitcoin Atom",
    network: "atom",
    coinValue: 185
  },
  {
    name: "BCH - Bitcoin Cash",
    network: "bitcoin",
    // DOM.bitcoinCashAddressTypeContainer.removeClass("hidden");
    coinValue: 145
  },
  {
    name: "BEET - Beetlecoin",
    network: "beetlecoin",
    coinValue: 800
  },
  {
    name: "BELA - Belacoin",
    network: "belacoin",
    coinValue: 73
  },
  {
    name: "BLK - BlackCoin",
    network: "blackcoin",
    coinValue: 10
  },
  {
    name: "BND - Blocknode",
    network: "blocknode",
    coinValue: 2941
  },
  {
    name: "tBND - Blocknode Testnet",
    network: "blocknode_testnet",
    coinValue: 1
  },
  {
    name: "BRIT - Britcoin",
    network: "britcoin",
    coinValue: 70
  },
  {
    name: "BSD - Bitsend",
    network: "bitsend",
    coinValue: 91
  },
  {
    name: "BST - BlockStamp",
    network: "blockstamp",
    coinValue: 254
  },
  {
    name: "BTA - Bata",
    network: "bata",
    coinValue: 89
  },
  {
    name: "BTC - Bitcoin",
    network: "bitcoin",
    coinValue: 0
  },
  {
    name: "BTC - Bitcoin Testnet",
    network: "testnet",
    coinValue: 1
  },
  {
    name: "BITG - Bitcoin Green",
    network: "bitcoingreen",
    coinValue: 222
  },
  {
    name: "BTCP - Bitcoin Private",
    network: "bitcoinprivate",
    coinValue: 183
  },
  {
    name: "BTCZ - Bitcoinz",
    network: "bitcoinz",
    coinValue: 177
  },
  {
    name: "BTDX - BitCloud",
    network: "bitcloud",
    coinValue: 218
  },
  {
    name: "BTG - Bitcoin Gold",
    network: "bgold",
    coinValue: 156
  },
  {
    name: "BTX - Bitcore",
    network: "bitcore",
    coinValue: 160
  },
  {
    name: "CCN - Cannacoin",
    network: "cannacoin",
    coinValue: 19
  },
  {
    name: "CESC - Cryptoescudo",
    network: "cannacoin",
    coinValue: 111
  },
  {
    name: "CDN - Canadaecoin",
    network: "canadaecoin",
    coinValue: 34
  },
  {
    name: "CLAM - Clams",
    network: "clam",
    coinValue: 23
  },
  {
    name: "CLO - Callisto",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 820
  },
  {
    name: "CLUB - Clubcoin",
    network: "clubcoin",
    coinValue: 79
  },
  {
    name: "CMP - Compcoin",
    network: "compcoin",
    coinValue: 71
  },
  {
    name: "CRAVE - Crave",
    network: "crave",
    coinValue: 186
  },
  {
    name: "CRW - Crown (Legacy)",
    network: "crown",
    coinValue: 72
  },
  {
    name: "CRW - Crown",
    network: "crown",
    coinValue: 72
  },
  {
    name: "DASH - Dash",
    network: "dash",
    coinValue: 5
  },
  {
    name: "DASH - Dash Testnet",
    network: "dashtn",
    coinValue: 1
  },
  {
    name: "DFC - Defcoin",
    network: "defcoin",
    coinValue: 1337
  },
  {
    name: "DGB - Digibyte",
    network: "digibyte",
    coinValue: 20
  },
  {
    name: "DGC - Digitalcoin",
    network: "digitalcoin",
    coinValue: 18
  },
  {
    name: "DMD - Diamond",
    network: "diamond",
    coinValue: 152
  },
  {
    name: "DNR - Denarius",
    network: "denarius",
    coinValue: 116
  },
  {
    name: "DOGE - Dogecoin",
    network: "dogecoin",
    coinValue: 3
  },
  {
    name: "DXN - DEXON",
    network: "bitcoin",
    coinValue: 237
  },
  {
    name: "ECN - Ecoin",
    network: "ecoin",
    coinValue: 115
  },
  {
    name: "EDRC - Edrcoin",
    network: "edrcoin",
    coinValue: 56
  },
  {
    name: "EFL - Egulden",
    network: "egulden",
    coinValue: 78
  },
  {
    name: "ELLA - Ellaism",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 163
  },
  {
    name: "EMC2 - Einsteinium",
    network: "einsteinium",
    coinValue: 41
  },
  {
    name: "ERC - Europecoin",
    network: "europecoin",
    coinValue: 151
  },
  {
    name: "ESN - Ethersocial Network",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 31102
  },
  {
    name: "ETC - Ethereum Classic",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 61
  },
  {
    name: "ETH - Ethereum",
    network: "bitcoin",
    coinValue: 60
  },
  {
    name: "EXCL - Exclusivecoin",
    network: "exclusivecoin",
    coinValue: 190
  },
  {
    name: "EXCC - ExchangeCoin",
    network: "exchangecoin",
    coinValue: 0
  },
  {
    name: "EXP - Expanse",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 40
  },
  {
    name: "FJC - Fujicoin",
    network: "fujicoin",
    coinValue: 75
  },
  {
    name: "FLASH - Flashcoin",
    network: "flashcoin",
    coinValue: 120
  },
  {
    name: "FRST - Firstcoin",
    network: "firstcoin",
    coinValue: 167
  },
  {
    name: "FTC - Feathercoin",
    network: "feathercoin",
    coinValue: 8
  },
  {
    name: "GAME - GameCredits",
    network: "game",
    coinValue: 101
  },
  {
    name: "GBX - Gobyte",
    network: "gobyte",
    coinValue: 176
  },
  {
    name: "GCR - GCRCoin",
    network: "gcr",
    coinValue: 79
  },
  {
    name: "GRC - Gridcoin",
    network: "gridcoin",
    coinValue: 84
  },
  {
    name: "HNC - Helleniccoin",
    network: "helleniccoin",
    coinValue: 168
  },
  {
    name: "HUSH - Hush",
    network: "hush",
    coinValue: 197
  },
  {
    name: "INSN - Insane",
    network: "insane",
    coinValue: 68
  },
  {
    name: "IOP - Iop",
    network: "iop",
    coinValue: 66
  },
  {
    name: "IXC - Ixcoin",
    network: "ixcoin",
    coinValue: 86
  },
  {
    name: "JBS - Jumbucks",
    network: "jumbucks",
    coinValue: 26
  },
  {
    name: "KMD - Komodo",
    bip49available: false,
    network: "komodo",
    coinValue: 141
  },
  {
    name: "KOBO - Kobocoin",
    bip49available: false,
    network: "kobocoin",
    coinValue: 196
  },
  {
    name: "LBC - Library Credits",
    network: "lbry",
    coinValue: 140
  },
  {
    name: "LCC - Litecoincash",
    network: "litecoincash",
    coinValue: 192
  },
  {
    name: "LDCN - Landcoin",
    network: "landcoin",
    coinValue: 63
  },
  {
    name: "LINX - Linx",
    network: "linx",
    coinValue: 114
  },
  {
    name: "LKR - Lkrcoin",
    segwitAvailable: false,
    network: "lkrcoin",
    coinValue: 557
  },
  {
    name: "LTC - Litecoin",
    network: "litecoin",
    coinValue: 2
    // DOM.litecoinLtubContainer.removeClass("hidden");
  },
  {
    name: "LTZ - LitecoinZ",
    network: "litecoinz",
    coinValue: 221
  },
  {
    name: "LYNX - Lynx",
    network: "lynx",
    coinValue: 191
  },
  {
    name: "MAZA - Maza",
    network: "maza",
    coinValue: 13
  },
  {
    name: "MEC - Megacoin",
    network: "megacoin",
    coinValue: 217
  },
  {
    name: "MIX - MIX",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 76
  },
  {
    name: "MNX - Minexcoin",
    network: "minexcoin",
    coinValue: 182
  },
  {
    name: "MONA - Monacoin",
    network: "monacoin",
    coinValue: 22
  },
  {
    name: "MUSIC - Musicoin",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 184
  },
  {
    name: "NAV - Navcoin",
    network: "navcoin",
    coinValue: 130
  },
  {
    name: "NAS - Nebulas",
    network: "bitcoin",
    coinValue: 2718
  },
  {
    name: "NEBL - Neblio",
    network: "neblio",
    coinValue: 146
  },
  {
    name: "NEOS - Neoscoin",
    network: "neoscoin",
    coinValue: 25
  },
  {
    name: "NIX - NIX Platform",
    network: "nix",
    coinValue: 400
  },
  {
    name: "NLG - Gulden",
    network: "gulden",
    coinValue: 87
  },
  {
    name: "NMC - Namecoin",
    network: "namecoin",
    coinValue: 7
  },
  {
    name: "NRG - Energi",
    network: "energi",
    coinValue: 204
  },
  {
    name: "NRO - Neurocoin",
    network: "neurocoin",
    coinValue: 110
  },
  {
    name: "NSR - Nushares",
    network: "nushares",
    coinValue: 11
  },
  {
    name: "NYC - Newyorkc",
    network: "newyorkc",
    coinValue: 179
  },
  {
    name: "NVC - Novacoin",
    network: "novacoin",
    coinValue: 50
  },
  {
    name: "OK - Okcash",
    network: "okcash",
    coinValue: 69
  },
  {
    name: "OMNI - Omnicore",
    network: "omnicore",
    coinValue: 200
  },
  {
    name: "ONION - DeepOnion",
    network: "deeponion",
    coinValue: 305
  },
  {
    name: "ONX - Onixcoin",
    network: "onixcoin",
    coinValue: 174
  },
  {
    name: "PHR - Phore",
    network: "phore",
    coinValue: 444
  },
  {
    name: "PINK - Pinkcoin",
    network: "pinkcoin",
    coinValue: 117
  },
  {
    name: "PIRL - Pirl",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 164
  },
  {
    name: "PIVX - PIVX",
    network: "pivx",
    coinValue: 119
  },
  {
    name: "PIVX - PIVX Testnet",
    network: "pivxtestnet",
    coinValue: 1
  },
  {
    name: "POA - Poa",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 178
  },
  {
    name: "POSW - POSWcoin",
    network: "poswcoin",
    coinValue: 47
  },
  {
    name: "POT - Potcoin",
    network: "potcoin",
    coinValue: 81
  },
  {
    name: "PPC - Peercoin",
    network: "peercoin",
    coinValue: 6
  },
  {
    name: "PRJ - ProjectCoin",
    network: "projectcoin",
    coinValue: 533
  },
  {
    name: "PSB - Pesobit",
    network: "pesobit",
    coinValue: 62
  },
  {
    name: "PUT - Putincoin",
    network: "putincoin",
    coinValue: 122
  },
  {
    name: "RVN - Ravencoin",
    network: "ravencoin",
    coinValue: 175
  },
  {
    name: "RBY - Rubycoin",
    network: "rubycoin",
    coinValue: 16
  },
  {
    name: "RDD - Reddcoin",
    network: "reddcoin",
    coinValue: 4
  },
  {
    name: "RVR - RevolutionVR",
    network: "revolutionvr",
    coinValue: 129
  },
  {
    name: "SAFE - Safecoin",
    network: "safecoin",
    coinValue: 19165
  },
  {
    name: "SLS - Salus",
    network: "salus",
    coinValue: 63
  },
  {
    name: "SDC - ShadowCash",
    network: "shadow",
    coinValue: 35
  },
  {
    name: "SDC - ShadowCash Testnet",
    network: "shadowtn",
    coinValue: 1
  },
  {
    name: "SLM - Slimcoin",
    network: "slimcoin",
    coinValue: 63
  },
  {
    name: "SLM - Slimcoin Testnet",
    network: "slimcointn",
    coinValue: 111
  },
  {
    name: "SLP - Simple Ledger Protocol",
    network: "bitcoin",
    // DOM.bitcoinCashAddressTypeContainer.removeClass("hidden");
    coinValue: 245
  },
  {
    name: "SLR - Solarcoin",
    network: "solarcoin",
    coinValue: 58
  },
  {
    name: "SMLY - Smileycoin",
    network: "smileycoin",
    coinValue: 59
  },
  {
    name: "STASH - Stash",
    network: "stash",
    coinValue: 0xc0c0
  },
  {
    name: "STASH - Stash Testnet",
    network: "stashtn",
    coinValue: 0xcafe
  },
  {
    name: "STRAT - Stratis",
    network: "stratis",
    coinValue: 105
  },
  {
    name: "TSTRAT - Stratis Testnet",
    network: "stratistest",
    coinValue: 105
  },
  {
    name: "SYS - Syscoin",
    network: "syscoin",
    coinValue: 57
  },
  {
    name: "THC - Hempcoin",
    network: "hempcoin",
    coinValue: 113
  },
  {
    name: "TOA - Toa",
    network: "toa",
    coinValue: 159
  },
  {
    name: "USC - Ultimatesecurecash",
    network: "ultimatesecurecash",
    coinValue: 112
  },
  {
    name: "USNBT - NuBits",
    network: "nubits",
    coinValue: 12
  },
  {
    name: "UNO - Unobtanium",
    network: "unobtanium",
    coinValue: 92
  },
  {
    name: "VASH - Vpncoin",
    network: "vpncoin",
    coinValue: 33
  },
  {
    name: "VIA - Viacoin",
    network: "viacoin",
    coinValue: 14
  },
  {
    name: "VIA - Viacoin Testnet",
    network: "viacointestnet",
    coinValue: 1
  },
  {
    name: "VIVO - Vivo",
    network: "vivo",
    coinValue: 166
  },
  {
    name: "VTC - Vertcoin",
    network: "vertcoin",
    coinValue: 28
  },
  {
    name: "WC - Wincoin",
    network: "wincoin",
    coinValue: 181
  },
  {
    name: "XAX - Artax",
    network: "artax",
    coinValue: 219
  },
  {
    name: "XBC - Bitcoinplus",
    network: "bitcoinplus",
    coinValue: 65
  },
  {
    name: "XMY - Myriadcoin",
    network: "myriadcoin",
    coinValue: 90
  },
  {
    name: "XRP - Ripple",
    network: "bitcoin",
    coinValue: 144
  },
  {
    name: "XVC - Vcash",
    network: "vcash",
    coinValue: 127
  },
  {
    name: "XVG - Verge",
    network: "verge",
    coinValue: 77
  },
  {
    name: "XUEZ - Xuez",
    segwitAvailable: false,
    network: "xuez",
    coinValue: 225
  },
  {
    name: "XWC - Whitecoin",
    network: "whitecoin",
    coinValue: 155
  },
  {
    name: "XZC - Zcoin",
    network: "zcoin",
    coinValue: 136
  },
  {
    name: "ZCL - Zclassic",
    network: "zclassic",
    coinValue: 147
  },
  {
    name: "ZEC - Zcash",
    network: "zcash",
    coinValue: 133
  },
  {
    name: "ZEN - Zencash",
    network: "zencash",
    coinValue: 121
  },
  {
    name: "XLM - Stellar",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 148,
    purposeValue: 44,
    derivationStandard: "sep5",
    curveName: "ed25519"
  },
  {
    name: "ZBC - Zoobc",
    segwitAvailable: false,
    network: "bitcoin",
    coinValue: 148,
    purposeValue: 44,
    derivationStandard: "sep5",
    curveName: "ed25519"
  }
];

interface CoinInterface {
  name: string;
  segwitAvailable?: boolean;
  bip49available?: boolean;
  network: string;
  coinValue: number;
  purposeValue?: number;
  derivationStandard?:
    | "sep5"
    | "bip32"
    | "bip44"
    | "bip49"
    | "bip84"
    | "bip141";
  curveName?: "secp256k1" | "P-256" | "ed25519";
}

interface Network {
  wif: number;
  bip32: {
    public: number;
    private: number;
  };
  messagePrefix?: string;
  bech32?: string;
  pubKeyHash?: number;
  scriptHash?: number;
}

export function getCoin(coinName: string): CoinInterface {
  const coinConfig = coins.find(c => c.name.startsWith(coinName));
  if (!coinConfig) throw new Error("coin not found");
  return coinConfig;
}

export function hasStrongRandom() {
  return "crypto" in window && window["crypto"] !== null;
}

export function uint8ArrayToHex(a) {
  let s = "";
  for (let i = 0; i < a.length; i++) {
    let h = a[i].toString(16);
    while (h.length < 2) {
      h = "0" + h;
    }
    s = s + h;
  }
  return s;
}

export function parseIntNoNaN(val, defaultVal: number) {
  const v = parseInt(val);
  if (isNaN(v)) {
    return defaultVal;
  }
  return v;
}

export function calcBip32ExtendedKey(
  path: string,
  bip32RootKey: BIP32Interface,
  curveName: "secp256k1" | "P-256" | "ed25519"
): BIP32Interface {
  // Check there's a root key to derive from
  if (!bip32RootKey) {
    return bip32RootKey;
  }
  var extendedKey = bip32RootKey;
  // Derive the key from the path
  var pathBits = path.split("/");
  for (var i = 0; i < pathBits.length; i++) {
    var bit = pathBits[i];
    var index = parseInt(bit);
    if (isNaN(index)) {
      continue;
    }
    var hardened = bit[bit.length - 1] == "'";
    var isPriv = !extendedKey.isNeutered();
    var invalidDerivationPath = hardened && !isPriv;
    if (invalidDerivationPath) {
      extendedKey = null;
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index, curveName);
    } else {
      extendedKey = extendedKey.derive(index, curveName);
    }
  }
  return extendedKey;
}

export function displayBip32Info(
  bip32RootKey: BIP32Interface,
  bip32ExtendedKey: BIP32Interface
) {
  // Display the key
  // DOM.seed.val(seed);
  const rootKey = bip32RootKey.toBase58();
  // DOM.rootKey.val(rootKey);
  let xprvkeyB58 = "NA";
  if (!bip32ExtendedKey.isNeutered()) {
    xprvkeyB58 = bip32ExtendedKey.toBase58();
  }
  const extendedPrivKey = xprvkeyB58;
  // DOM.extendedPrivKey.val(extendedPrivKey);
  const extendedPubKey = bip32ExtendedKey.neutered().toBase58();
  // DOM.extendedPubKey.val(extendedPubKey);
  // Display the addresses and privkeys
  // clearAddressesList();
  // var initialAddressCount = parseInt(DOM.rowsToAdd.val());
  // displayAddresses(0, initialAddressCount);

  return {
    rootKey,
    extendedPrivKey,
    extendedPubKey
  };
}

export function getDerivationPath(
  derivationStandard: string,
  purposeValue: string,
  coinValue: string,
  accountValue: string,
  changeValue: string
): string {
  if (derivationStandard === "sep5") {
    var purpose = parseIntNoNaN(purposeValue, 44);
    var coin = parseIntNoNaN(coinValue, 0);
    var account = parseIntNoNaN(accountValue, 0);
    var path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'";
    return path;
    // DOM.bip44path.val(path);
    // var derivationPath = DOM.bip44path.val();
    // console.log("Using derivation path from BIP44 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === "bip44") {
    var purpose = parseIntNoNaN(purposeValue, 44);
    var coin = parseIntNoNaN(coinValue, 0);
    var account = parseIntNoNaN(accountValue, 0);
    var change = parseIntNoNaN(changeValue, 0);
    var path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
    // DOM.bip44path.val(path);
    // var derivationPath = DOM.bip44path.val();
    // console.log("Using derivation path from BIP44 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === "bip49") {
    var purpose = parseIntNoNaN(purposeValue, 49);
    var coin = parseIntNoNaN(coinValue, 0);
    var account = parseIntNoNaN(accountValue, 0);
    var change = parseIntNoNaN(changeValue, 0);
    var path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
    // DOM.bip49path.val(path);
    // var derivationPath = DOM.bip49path.val();
    // console.log("Using derivation path from BIP49 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === "bip84") {
    var purpose = parseIntNoNaN(purposeValue, 84);
    var coin = parseIntNoNaN(coinValue, 0);
    var account = parseIntNoNaN(accountValue, 0);
    var change = parseIntNoNaN(changeValue, 0);
    var path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
    // DOM.bip84path.val(path);
    // var derivationPath = DOM.bip84path.val();
    // console.log("Using derivation path from BIP84 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === "bip32") {
    return null;
    // var derivationPath = DOM.bip32path.val();
    // console.log("Using derivation path from BIP32 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === "bip141") {
    return null;
    // var derivationPath = DOM.bip141path.val();
    // console.log("Using derivation path from BIP141 tab: " + derivationPath);
    // return derivationPath;
  } else {
    console.log("Unknown derivation path");
  }
}

export function findDerivationPathErrors(path: string) {
  // TODO is not perfect but is better than nothing
  // Inspired by
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors
  // and
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#extended-keys
  var maxDepth = 255; // TODO verify this!!
  var maxIndexValue = Math.pow(2, 31); // TODO verify this!!
  if (path[0] != "m") {
    return "First character must be 'm'";
  }
  if (path.length > 1) {
    if (path[1] != "/") {
      return "Separator must be '/'";
    }
    var indexes = path.split("/");
    if (indexes.length > maxDepth) {
      return (
        "Derivation depth is " +
        indexes.length +
        ", must be less than " +
        maxDepth
      );
    }
    for (var depth = 1; depth < indexes.length; depth++) {
      var index = indexes[depth];
      var invalidChars = index.replace(/^[0-9]+'?$/g, "");
      if (invalidChars.length > 0) {
        return (
          "Invalid characters " + invalidChars + " found at depth " + depth
        );
      }
      var indexValue = parseInt(index.replace("'", ""));
      if (isNaN(depth)) {
        return "Invalid number at depth " + depth;
      }
      if (indexValue > maxIndexValue) {
        return (
          "Value of " +
          indexValue +
          " at depth " +
          depth +
          " must be less than " +
          maxIndexValue
        );
      }
    }
  }
  // Check root key exists or else derivation path is useless!
  // if (!bip32RootKey) {
  //     return "No root key";
  // }
  // Check no hardened derivation path when using xpub keys
  // var hardenedPath = path.indexOf("'") > -1;
  // var hardenedAddresses = bip32TabSelected() && DOM.hardenedAddresses.prop("checked");
  // var hardened = hardenedPath || hardenedAddresses;
  // var isXpubkey = bip32RootKey.isNeutered();
  // if (hardened && isXpubkey) {
  //     return "Hardened derivation path is invalid with xpub key";
  // }
  return false;
}

// export function arrayByteToHex(bytes) {
//   return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// }

@Injectable({
  providedIn: "root"
})
export class KeyringService {
  // Each (hardware) wallet has only one seed. The seed can be represented in words.
  // One seed can be used for more than one network (e.g. Bitcoin, Ethereum, Ethereum Class, Ripple).
  // Unique rootKeys are generated for each network.
  // One rootKey can have multiple accounts (to separate balances, e.g. Savings / Current)
  // One account can have multiple sub-addresses (consolidated into a single balance)
  // Each sub-adddress has its own private-key and public-key (the "address")
  // Transactions can have unlimited number of "inputs" (sub-addresses used as source of coins).
  // Transaction must be signed by each address-level private-keys involved as an input.
  // Multiple signatures are attached to the transaction for verification.

  /**
   * The seed is in hexadecimal format
   */
  private seed: string;
  private bip32RootKey: BIP32Interface;
  private bip32ExtendedKey: BIP32Interface;

  constructor(
    private mnemonicsService: MnemonicsService,
    @Inject(APP_CONFIG) private config: AppConfig,
    @Inject("global") private global: any
  ) {}

  getNetwork(networkName: string): Network {
    const networkConfig: Network = this.global.bitcoinjs.bitcoin.networks[
      networkName
    ];
    if (!networkConfig) {
      throw new Error("network not found in bitcoinjs' list");
    }
    return networkConfig;
  }

  generateRandomPhrase(
    numWords = this.config.mnemonicNumWords
  ): { [key: string]: string } {
    if (!hasStrongRandom()) {
      const errorText = "This browser does not support strong randomness";
      throw new Error(errorText);
    }
    // get the amount of entropy to use
    const strength = (numWords / 3) * 32;
    const buffer = new Uint8Array(strength / 8);
    // create secure entropy
    const data = crypto.getRandomValues(buffer);
    // show the words
    const words = this.mnemonicsService.mnemonic.toMnemonic(data);
    // DOM.phrase.val(words);
    // show the entropy
    const entropyHex = uint8ArrayToHex(data);
    // DOM.entropy.val(entropyHex);
    // ensure entropy fields are consistent with what is being displayed
    // DOM.entropyMnemonicLength.val("raw");
    return {
      phrase: words,
      entropy: entropyHex,
      entropyMnemonicLength: "raw"
    };
  }

  calcBip32RootKeyFromSeed(
    coinName: string,
    phrase: string,
    passphrase: string
  ) {
    const { network: networkName, curveName = "secp256k1" } = getCoin(coinName);
    this.seed = this.mnemonicsService.mnemonic.toSeed(phrase, passphrase);
    this.bip32RootKey = bip32.fromSeed(
      Buffer.from(this.seed, "hex"),
      this.getNetwork(networkName),
      curveName
    );
    return {
      seed: this.seed,
      bip32RootKey: this.bip32RootKey
    };
  }

  calcForDerivationPathForCoin(
    coinName: string,
    accountValue: number,
    changeValue: 0 | 1 = 0,
    bip32RootKey: BIP32Interface = this.bip32RootKey
  ) {
    const {
      curveName = "secp256k1",
      derivationStandard = "bip44",
      purposeValue = "44",
      coinValue
    } = getCoin(coinName);

    return this.calcForDerivationPath(
      curveName,
      derivationStandard,
      String(purposeValue),
      String(coinValue),
      String(accountValue),
      String(changeValue),
      bip32RootKey
    );
  }

  calcForDerivationPath(
    curveName: "secp256k1" | "P-256" | "ed25519",
    derivationStandard: string,
    purposeValue: string,
    coinValue: string,
    accountValue: string,
    changeValue: string = "0",
    bip32RootKey: BIP32Interface = this.bip32RootKey
  ) {
    // clearDerivedKeys();
    // clearAddressesList();
    // showPending();
    //
    // TODO: Segwit support
    // Don't show segwit if it's selected but network doesn't support it
    // if (segwitSelected() && !networkHasSegwit()) {
    //     showSegwitUnavailable();
    //     hidePending();
    //     return;
    // }
    // showSegwitAvailable();
    //
    // Get the derivation path
    var derivationPath = getDerivationPath(
      derivationStandard,
      purposeValue,
      coinValue,
      accountValue,
      changeValue
    );
    var errorText = findDerivationPathErrors(derivationPath);
    if (errorText) {
      // showValidationError(errorText);
      throw new Error(errorText);
    }
    this.bip32ExtendedKey = calcBip32ExtendedKey(
      derivationPath,
      bip32RootKey,
      curveName
    );
    if (["sep5", "bip44", "bip49", "bip84"].includes(derivationStandard)) {
      // Calculate the account extended keys
      const extraSliceTo = ["bip44", "bip49", "bip84"].includes(
        derivationStandard
      )
        ? 1
        : 0;
      const accountPath = derivationPath.slice(
        0,
        derivationPath.lastIndexOf("/") + extraSliceTo
      );
      const accountExtendedKey = calcBip32ExtendedKey(
        accountPath,
        bip32RootKey,
        curveName
      );
      // console.debug("accountPath", accountPath);
      // console.debug("accountPrivateKey", accountExtendedKey.privateKey);
      const accountXprv = accountExtendedKey.toBase58();
      const accountXpub = accountExtendedKey.neutered().toBase58();
      return {
        accountPath,
        accountXprv,
        accountXpub,
        derivationPath,
        derivationPrivKey: this.bip32ExtendedKey.privateKey,
        ...displayBip32Info(this.bip32RootKey, this.bip32ExtendedKey)
      };
    } else {
      return {
        derivationPath,
        derivationPrivKey: this.bip32ExtendedKey.privateKey,
        ...displayBip32Info(this.bip32RootKey, this.bip32ExtendedKey)
      };
    }
  }

  get extendedSeed() {
    return this.bip32ExtendedKey.privateKey;
  }

  //   function phraseChanged() {
  //     showPending();
  //     setMnemonicLanguage();
  //     // Get the mnemonic phrase
  //     var phrase = DOM.phrase.val();
  //     var errorText = findPhraseErrors(phrase);
  //     if (errorText) {
  //         showValidationError(errorText);
  //         return;
  //     }
  //     // Calculate and display
  //     var passphrase = DOM.passphrase.val();
  //     calcBip32RootKeyFromSeed(phrase, passphrase);
  //     calcForDerivationPath();
  //     // Show the word indexes
  //     showWordIndexes();
  //   }

  //   networkChanged(e) {
  //     clearDerivedKeys();
  //     clearAddressesList();
  //     // DOM.litecoinLtubContainer.addClass("hidden");
  //     // DOM.bitcoinCashAddressTypeContainer.addClass("hidden");
  //     var networkIndex = e.target.value;
  //     var network = networks[networkIndex];
  //     network.onSelect();
  //     adjustNetworkForSegwit();
  //     if (seed != null) {
  //         phraseChanged();
  //     }
  //     else {
  //         rootKeyChanged();
  //     }
  // }
}
