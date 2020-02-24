import { BIP32Interface } from 'externals/bip32';
export { BIP32Interface } from 'externals/bip32';

export {
  fromSeed,
  fromPublicKey,
  fromPrivateKey,
  fromBase58,
} from 'externals/bip32';

export interface Network {
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

export function parseIntNoNaN(val, defaultVal: number) {
  // tslint:disable-next-line:radix
  const v = parseInt(val);
  if (isNaN(v)) {
    return defaultVal;
  }
  return v;
}

export function calcBip32ExtendedKey(
  path: string,
  curveName: 'secp256k1' | 'P-256' | 'ed25519',
  bip32RootKey: BIP32Interface
): BIP32Interface {
  // Check there's a root key to derive from
  if (!bip32RootKey) {
    return bip32RootKey;
  }
  // return bip32RootKey.derivePath(path, curveName);

  let extendedKey = bip32RootKey;
  // Derive the key from the path
  const pathBits = path.split('/');
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < pathBits.length; i++) {
    const bit = pathBits[i];
    // tslint:disable-next-line:radix
    const index = parseInt(bit);
    if (isNaN(index)) {
      continue;
    }
    const hardened = bit[bit.length - 1] === '\'';
    const isPriv = !extendedKey.isNeutered();
    const invalidDerivationPath = hardened && !isPriv;
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
  let xprvkeyB58 = 'NA';
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
    extendedPubKey,
  };
}

export function getDerivationPath(
  derivationStandard: string,
  purposeValue: string,
  coinValue: string,
  accountValue: string,
  changeValue: string
): string {
  if (derivationStandard === 'sep5') {
    const purpose = parseIntNoNaN(purposeValue, 44);
    const coin = parseIntNoNaN(coinValue, 0);
    const account = parseIntNoNaN(accountValue, 0);
    let path = 'm/';
    path += purpose + '\'/';
    path += coin + '\'/';
    path += account + '\'';
    return path;
    // DOM.bip44path.val(path);
    // var derivationPath = DOM.bip44path.val();
    // console.log("Using derivation path from BIP44 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === 'bip44') {
    const purpose = parseIntNoNaN(purposeValue, 44);
    const coin = parseIntNoNaN(coinValue, 0);
    const account = parseIntNoNaN(accountValue, 0);
    const change = parseIntNoNaN(changeValue, 0);
    let path = 'm/';
    path += purpose + '\'/';
    path += coin + '\'/';
    path += account + '\'/';
    path += change;
    return path;
    // DOM.bip44path.val(path);
    // var derivationPath = DOM.bip44path.val();
    // console.log("Using derivation path from BIP44 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === 'bip49') {
    const purpose = parseIntNoNaN(purposeValue, 49);
    const coin = parseIntNoNaN(coinValue, 0);
    const account = parseIntNoNaN(accountValue, 0);
    const change = parseIntNoNaN(changeValue, 0);
    let path = 'm/';
    path += purpose + '\'/';
    path += coin + '\'/';
    path += account + '\'/';
    path += change;
    return path;
    // DOM.bip49path.val(path);
    // var derivationPath = DOM.bip49path.val();
    // console.log("Using derivation path from BIP49 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === 'bip84') {
    const purpose = parseIntNoNaN(purposeValue, 84);
    const coin = parseIntNoNaN(coinValue, 0);
    const account = parseIntNoNaN(accountValue, 0);
    const change = parseIntNoNaN(changeValue, 0);
    let path = 'm/';
    path += purpose + '\'/';
    path += coin + '\'/';
    path += account + '\'/';
    path += change;
    return path;
    // DOM.bip84path.val(path);
    // var derivationPath = DOM.bip84path.val();
    // console.log("Using derivation path from BIP84 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === 'bip32') {
    return null;
    // var derivationPath = DOM.bip32path.val();
    // console.log("Using derivation path from BIP32 tab: " + derivationPath);
    // return derivationPath;
  } else if (derivationStandard === 'bip141') {
    return null;
    // var derivationPath = DOM.bip141path.val();
    // console.log("Using derivation path from BIP141 tab: " + derivationPath);
    // return derivationPath;
  } else {
    console.log('Unknown derivation path');
  }
}

export function findDerivationPathErrors(path: string) {
  // TODO is not perfect but is better than nothing
  // Inspired by
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors
  // and
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#extended-keys
  const maxDepth = 255; // TODO verify this!!
  const maxIndexValue = Math.pow(2, 31); // TODO verify this!!
  if (path[0] !== 'm') {
    return 'First character must be \'m\'';
  }
  if (path.length > 1) {
    if (path[1] !== '/') {
      return 'Separator must be \'/\'';
    }
    const indexes = path.split('/');
    if (indexes.length > maxDepth) {
      return (
        'Derivation depth is ' +
        indexes.length +
        ', must be less than ' +
        maxDepth
      );
    }
    for (let depth = 1; depth < indexes.length; depth++) {
      const index = indexes[depth];
      const invalidChars = index.replace(/^[0-9]+'?$/g, '');
      if (invalidChars.length > 0) {
        return (
          'Invalid characters ' + invalidChars + ' found at depth ' + depth
        );
      }
      // tslint:disable-next-line:radix
      const indexValue = parseInt(index.replace('\'', ''));
      if (isNaN(depth)) {
        return 'Invalid number at depth ' + depth;
      }
      if (indexValue > maxIndexValue) {
        return (
          'Value of ' +
          indexValue +
          ' at depth ' +
          depth +
          ' must be less than ' +
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