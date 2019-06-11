import { Injectable } from "@angular/core";
import { ConverterService } from './converter.service';

@Injectable({
  providedIn: "root"
})
export class CryptoService {
  private MASTER_SECRET = 'Bitcoin seed'

  constructor(
    private converterService: ConverterService
  ) {}

  genDeriveAlgo() {
    return this.safeObj({
      name: "PBKDF2",
      hash: "SHA-384", // Note: Non-truncated SHA is vulnerable to length extension attack (e.g. sha256 & sha512)
      salt: this.secureRandom(16, { type: "Uint8Array" }).buffer,
      iterations: 1e6
    });
  }

  genInitVector() {
    return this.secureRandom(12, { type: "Uint8Array" }).buffer;
  }

  browserRandom(count, options) {
    console.log("browser random", count, options)
    // eslint-disable-line
    const nativeArr = new Uint8Array(count);
    const crypto = window.crypto;
    crypto.getRandomValues(nativeArr);

    console.log("nativeArr", )

    switch (options.type) {
      case "Array":
        return [].slice.call(nativeArr);
      case "Buffer":
        try {
          Buffer.alloc(1);
        } catch (e) {
          throw new Error(
            "Buffer not supported in this environment. Use Node.js or Browserify for browser support."
          );
        }
        return Buffer.from(nativeArr);
      case "Uint8Array":
        return nativeArr;
      default:
        throw new Error(`${options.type} is unsupported.`);
    }
  }

  secureRandom(count, options = { type: "Array" }) {
    // eslint-disable-line
    const crypto = window.crypto;
    if (!crypto)
      throw new Error("Your browser does not support window.crypto.");
    return this.browserRandom(count, options);
  }

  safeObj(obj) {
    return Object.assign(Object.create(null), obj);
  }

  getCrypto() {
    const crypto = window.crypto;
    if (!crypto)
      throw new Error("Your browser does not support window.crypto.");
    return crypto;
  }

  getCryptoSubtle() {
    const crypto = this.getCrypto();
    return crypto.subtle;
  }

  wrapKey(
    plainkeyArrayBuf,
    strongCryptoKey,
    { format, keyAlgo, wrapAlgo, deriveAlgo }
  ) {
    const subtle = this.getCryptoSubtle();

    // Convert the secretKey into a native CryptoKey
    return subtle
      .importKey("raw", plainkeyArrayBuf, this.safeObj(keyAlgo), true, [
        "encrypt",
        "decrypt"
      ])
      .then(cryptoKey =>
        // Use the Strengthened/Strong CryptoKey to wrap / encrypt the main CryptoKey
        subtle
          .wrapKey(format, cryptoKey, strongCryptoKey, this.safeObj(wrapAlgo))
          .then(ciphertextBuffer => (
            {
              format,
              key: ciphertextBuffer,
              keyAlgo,
              wrapAlgo,
              deriveAlgo
            })
          )
      );
  }

  wrapKeyWithPin(plainkeyArrayBuf, secretPinArrayBuf, opts) {
    const subtle = this.getCryptoSubtle();

    const { keyAlgo, deriveAlgo } = opts;

    // Convert the Pin into a native CryptoKey
    return subtle
      .importKey("raw", secretPinArrayBuf, deriveAlgo.name, false, [
        "deriveKey"
      ])
      .then(weakKey =>
        // Strengthen the Pin CryptoKey by using PBKDF2
        subtle.deriveKey(
          this.safeObj(deriveAlgo),
          weakKey,
          this.safeObj(keyAlgo),
          false,
          ["encrypt", "wrapKey"]
        )
      )
      .then(strongKey =>
        // Use the Strengthened CryptoKey to wrap the main CryptoKey
        this.wrapKey(plainkeyArrayBuf, strongKey, opts)
      );
  }

  digestKeyed(keyArrayBuf, messageArrayBuf, algo = { name: 'SHA-512' }){
    // See: https://security.stackexchange.com/questions/79577/whats-the-difference-between-hmac-sha256key-data-and-sha256key-data
    const subtle = this.getCryptoSubtle()
    return subtle
      .importKey(
        'raw',
        keyArrayBuf,
        { name: 'HMAC', length: keyArrayBuf.byteLength * 8, hash: this.safeObj(algo) },
        false,
        ['sign', 'verify']
      )
      .then(cryptoKey => subtle.sign('HMAC', cryptoKey, messageArrayBuf))
  }

  rootKeyFromSeed(seedUint8) {
    const digestKeyUint8 = this.converterService.stringToArrayByte(this.MASTER_SECRET)
    return this.digestKeyed(digestKeyUint8, seedUint8, { name: 'SHA-512' })
    .then(digestBuffer => {
      // Note: Non-truncated SHA is vulnerable to length extension attack (e.g. sha256 & sha512)
      // We use a longer hash here and truncate to desired AES keySize (e.g. 256)
      const rootKeyUint8 = new Uint8Array(digestBuffer, 0, 256 / 8)
      // const chainCodeUint8 = new Uint8Array(digestBuffer, PRIVATE_KEY_LENGTH / 8)
      return rootKeyUint8
    })
  }
}
