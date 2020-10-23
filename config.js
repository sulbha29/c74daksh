import * as firebase from "firebase"
require('@firebase/firestore')



const firebaseConfig = {
    apiKey: "AIzaSyBWpzJd5500aaou1_LkEPinS_BgSInPHB4",
    authDomain: "library-helper-5725b.firebaseapp.com",
    databaseURL: "https://library-helper-5725b.firebaseio.com",
    projectId: "library-helper-5725b",
    storageBucket: "library-helper-5725b.appspot.com",
    messagingSenderId: "863615114841",
    appId: "1:863615114841:web:f73ef8e23e14cc776adb48"
  };

firebase.initializeApp(firebaseConfig)
export default firebase.firestore()


