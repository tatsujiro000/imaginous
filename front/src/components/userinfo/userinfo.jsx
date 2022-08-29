import { useState, useEffect } from "react";
import db from '../../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";




const UserInfo = () => {

    const [userinfo, setUserInfo] = useState(null);

    useEffect(()=>{
        const auth = getAuth();
        onAuthStateChanged(auth, async user => {
            if (!user) {
                console.log("error");
            }
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;

                //ユーザー情報の読み取り
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    console.log("No such document!");
                }

                console.log("Document data:", docSnap.data());
                const docData = docSnap.data();
                setUserInfo(docData);
            
        });

    },[]);
   

    return { userinfo }
}

export default UserInfo;