import { useState } from "react";
import db from '../../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


const UserId = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.log("error");
        return;
    }
    const uid = user.uid;

    //ユーザー情報の読み取り
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        console.log("No such document!");
    }
    const docData = docSnap.data();
    const userId = docData.id;

    return userId;
    
   
}

export default UserId;