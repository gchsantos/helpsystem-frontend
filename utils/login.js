import {getWithExpiry, removeItem} from './local-storage.js'

export function isLogged(){
    return getWithExpiry('commonUser') ? true : false;
}

export function logout(){
    removeItem('commonUser');
}