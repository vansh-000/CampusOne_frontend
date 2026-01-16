import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [institution, setInstitution] = useState(null);
    const [user, setUser] = useState(null);

    const [tokens, setTokens] = useState(() => ({
        institutionToken: localStorage.getItem("institutionToken") || null,
        userToken: localStorage.getItem("userToken") || null,
    }));

    const loginInstitution = (token, payload) => {
        localStorage.setItem("institutionToken", token);
        setTokens((prev) => ({ ...prev, institutionToken: token }));
        setInstitution(payload);
    };

    const loginUser = (token, payload) => {
        localStorage.setItem("userToken", token);
        setTokens((prev) => ({ ...prev, userToken: token }));
        setUser(payload);
    };

    const logoutInstitution = () => {
        localStorage.removeItem("institutionToken");
        setTokens((prev) => ({ ...prev, institutionToken: null }));
        setInstitution(null);
    };

    const logoutUser = () => {
        localStorage.removeItem("userToken");
        setTokens((prev) => ({ ...prev, userToken: null }));
        setUser(null);
    };

    const verifyInstitution = async (token) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/institutions/current-institution`, {
                headers: { Authorization: `Bearer ${token}` },
            }
            );

            if (!res.ok) return logoutInstitution();

            const data = await res.json();
            setInstitution(data);
        } catch (err) {
            logoutInstitution();
            console.log(err)
        }
    };

    const verifyUser = async (token) => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/current-user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) return logoutUser();

            const data = await res.json();
            setUser(data);
        } catch (err) {
            logoutUser();
            console.log(err)
        }
    };

    useEffect(() => {
        const run = async () => {
            if (tokens.institutionToken) await verifyInstitution(tokens.institutionToken);
            if (tokens.userToken) await verifyUser(tokens.userToken);
        };
        run();
    }, [tokens.institutionToken, tokens.userToken]);

    const value = {
        institution,
        user,
        tokens,
        loginInstitution,
        loginUser,
        logoutInstitution,
        logoutUser,
        isInstitutionLoggedIn: !!institution,
        isUserLoggedIn: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
