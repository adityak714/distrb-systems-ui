const CryptoTS = require('crypto-ts');
// I put hash in the private key here because in dotenv it does not work when sending to the backend, since backend does not recognize the key that is in my dotenv
const PRIVATE_KEY = 'fdc44954218150fdb03854043a337b6881abc317a46bbc4b481c241b02595a4f629c0b00d27570705b495f5ea51473480d7c0774359415b642291c32745782176d6492f6e24ce9bb2f32960775a3cb3762fc58c7ca217de5ac70b6076662677e16ecdf1c27a2fec5fd03c4aac0c4ea41ed78a09110f8f9dc02079e7f96733a7d48210c7a98613aa4b681b6a178ef14c7003370e230322f6cfddff26f1298097d'
//encrypt method
export function encrypt(credentials: Object) {
    const encrypted = CryptoTS.AES.encrypt(JSON.stringify(credentials), PRIVATE_KEY);
    return encrypted;
}

// decrypt method
export function decrypt(encryptedMessage: string){
    const bytes = CryptoTS.AES.decrypt(encryptedMessage, PRIVATE_KEY);
    const decryptedMessage = JSON.parse(bytes.toString(CryptoTS.enc.Utf8))
    return decryptedMessage;
  }