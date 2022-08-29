import { getAuth } from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";
import db from '../firebase';
import { collection, getDocs, orderBy, query, limit, where, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser ] = useState('');
    const [userId, setUserId ] = useState('');
    const [partnerId, setPartnerId ] = useState('');
    const [loading, setLoading ] = useState(true);
    const auth = getAuth();
    console.log("children", children)

    const value = {
        user,
        loading,
        userId,
        partnerId,
    };

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            setLoading(false);

            if (!user) {
                console.log("error");
                return;
            }
            const uid = user.uid;


            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                console.log("No such document!");
            }
            const docData = docSnap.data();
            const userIdData = docData.id;

            setUserId(userIdData);


            if (userIdData === "") {
                console.log("partnerId error");
                return;
            }

            const partnershipData = collection(db, "partnerships");

            const myPartnershipData = query(partnershipData, where("my_user_id", "==", userIdData), limit(1));
            console.log("myPartnershipData", myPartnershipData);

            const mypartnershipDocSnap = await getDocs(myPartnershipData);
            console.log("mypartnershipDocSnap", mypartnershipDocSnap);

            const partnerIdData = mypartnershipDocSnap.docs[0].data().partner_user_id;

            setPartnerId(partnerIdData);

            // mypartnershipDocSnap.forEach((doc) => {
            //     // doc.data() is never undefined for query doc snapshots
            //     console.log(doc.id, " => ", doc.data());
            // });

            // if (mypartnershipDocSnap.exists()) {
            //     const mypartnershipDocSnap = mypartnershipDocSnap.data();
            //     console.log("mypartnershipDocSnap", mypartnershipDocSnap);
            //     const mypartnershipId = mypartnershipDocSnap.partner_user_id
            //     setPartnerId(mypartnershipId);

            // } else {
            // // doc.data() will be undefined in this case
            //     console.log("No such document!");
            // }


        });
        return () => {
            unsubscribed();
        }
    },[]);
    

    if(loading){
        return <p>loading...</p>;
    } else {
        return <AuthContext.Provider value={value}>{!loading && children }</AuthContext.Provider>
    }
    
}
