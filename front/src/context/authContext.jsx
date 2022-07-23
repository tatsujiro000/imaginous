import { getAuth } from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children}) {
    const [user, setUser ] = useState('');
    const [loading, setLoading ] = useState(true);
    const auth = getAuth();

    const value = {
        user,
        loading,
    };

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
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
