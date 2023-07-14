import { createContext } from 'react';
import { GoogleUser } from '../../interfaces/user.interface';

interface ContextProps {
    user: GoogleUser | null;
    login: () => void;
    logout: () => void;
    loginWithGoogle: () => void;
    loginWithFacebook: () => void;
    loginWithEmail: () => void;
}
export const AuthContext = createContext<ContextProps>({} as ContextProps);