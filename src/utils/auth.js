import crypto from 'crypto';
import Cookies from 'universal-cookie';

import config from './../config.json';

const cookies = new Cookies();


export default class Auth {

    static encryptUserData(data) {
        var text = JSON.stringify(data);
        return Auth.encryptText(text);
    }

    static encryptText(text) {
        var cipher = crypto.createCipher(config.ENCRYPTION_ALGORITHM, config.ENCRYPTION_PASSWORD);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    static decryptText(text) {
        if (text) {
            var decipher = crypto.createDecipher(config.ENCRYPTION_ALGORITHM, config.ENCRYPTION_PASSWORD);
            var dec = decipher.update(text, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec;
        }
    }

    static decryptUserData(data) {
        return JSON.parse(Auth.decryptText(data));
    }

    static decryptToken(text) {
        if (text){
            var decipher = crypto.createDecipher(config.ENCRYPTION_ALGORITHM, config.ENCRYPTION_PASSWORD);
            var dec = decipher.update(text, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec.replace(/['"]+/g, '');
        }
    }

    static logout() {
        cookies.remove('user');
    }

    static getCurrentUser() {
        return Auth.decryptUserData(cookies.get('user'));
    }

    static getCurrentToken() {
        console.log('getting current token');
        return Auth.decryptToken(cookies.get('_bat'));
    }

}