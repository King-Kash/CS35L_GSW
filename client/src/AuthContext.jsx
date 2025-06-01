import React, {createContext, useState, useEffect} from "react";
import axios from "axios";

export const AuthContext = createContext({
    user: null,
    loading: true,
    setUser: () => {},
    checkAuth: () => {},
});

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function checkAuth() {
        try {
            const authStatus = await axios.get(
                'http://localhost:3000/api/auth/status',
                {
                    withCredentials: true
                }
            );
            if (authStatus.data.user) {
                setUser(authStatus.data.user);
            }
            else {
                setUser(null);
            }
        }
        catch(err) {
            setUser(null);
            console.error('Auth verification failed', err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading, checkAuth}}>
            {children}
        </AuthContext.Provider>
    );
}