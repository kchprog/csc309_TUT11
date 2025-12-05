import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: get the BACKEND_URL.

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(() => {
        // TODO: complete me, by retriving token from localStorage and make an api call to GET /user/me.
        const token = localStorage.getItem('token')
        if (!token) {
            setUser(null)
            return
        }
        
        // TRY TO FETCH THE USER'S DATA
        async function fetchUser() {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`,
                    {
                        method: "GET",
                        headers: {"Authorization":  `Bearer ${token}`}
                    }
                )

                if (!res.ok) {
                    setUser(null)
                    const { message } = await res.json();
                    return message || "unexpected err"
                }

                const data = await res.json();
                setUser(data.user);

            } catch (err) {
                setUser(null)
                return
            }
        }
        fetchUser()
    }, [])

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        setUser(null)
        localStorage.removeItem("token")
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        // TODO: complete me
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({username, password})
                }
            )

            if (!res.ok) {
                const { message } = await res.json();
                return message || "unexpected err"
            }

            //  STORE the token, update the user context state, redirect
            const data = await res.json()
            localStorage.setItem('token', data.token);
            setUser(data.user)

            navigate("/profile");
    
    
            return null;
        } catch (err) {
            return `Error is: ${err}`;
        }
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        // TODO: complete me
        try {
            console.log(import.meta.env.VITE_BACKEND_URL)
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(userData)
                }
            )

            if (!res.ok) {
                const { message } = await res.json();
                return message || "unexpected err"
            }

            navigate("/success")
            return null;
    
        } catch (err) {
            return `Error is: ${err}`;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
