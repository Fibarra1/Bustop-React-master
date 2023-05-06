import { createContext } from 'react';
import { GoogleUser } from '../../interfaces/user.interface';

interface ContextProps {
    user: GoogleUser | null;
    login: (user: GoogleUser) => void;
    logout: () => void;
    loginWithGoogle: () => void;
}
export const AuthContext = createContext<ContextProps>({} as ContextProps);