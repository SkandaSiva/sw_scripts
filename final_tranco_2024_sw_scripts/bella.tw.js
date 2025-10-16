function getUpdateTime(now)
{
    if(now) return new Date().getTime();
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    if(dd < 10){
        dd = '0' + dd;
    }
    if(mm < 10){
        mm = '0'+ mm;
    }
    return yyyy+'-'+mm+'-'+dd;
}

self.SENDER_ID = '';
self.NS_ID = '759748089731';

self.CONFIG = {
    apiKey: "AIzaSyBz1dm5I3Qg1Mjcx21IzgVC4nDCep39eAg",
    authDomain: "bellalikr.firebaseapp.com",
    projectId: "bellalikr",
    storageBucket: "bellalikr.appspot.com",
    messagingSenderId: "759748089731",
    appId: "1:759748089731:web:1caa839be9636e68b588b6",
    measurementId: "G-60HCYHM58D"
}

importScripts('https://avivid.likr.tw/pushEndPoint/js/sw_fcm_import_cert.js?20210825');