import { FC, type ReactNode, useReducer, useContext } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthContext, authReducer } from './';
import type { User } from '../../interfaces/user.interface';
import type { UserFromGoogle } from '../../interfaces/google_user.interface';

export interface AuthStateProps {
    user: User | UserFromGoogle | FirebaseAuthTypes.UserCredential | null;
}
interface ProviderProps {
    children: ReactNode;
}


const AUTH_INITIAL_STATE: AuthStateProps = {
    user: null,
};

export const useContextAuth = () => useContext(AuthContext);



export const AuthProvider: FC<ProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);


    const login = (user: User | UserFromGoogle | FirebaseAuthTypes.UserCredential) => {
        dispatch({
            type: '[Auth] - Login',
            payload: user,
        });
    }

    const logout = () => {
        dispatch({
            type: '[Auth] - Logout',
        })
    }

    const loginWithGoogle = async () => {
        //Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            //Sign-in the user with the credential
            const user = await auth().signInWithCredential(googleCredential);
            login(user);
        } catch (error) {
            console.log('[desde loginWithGoogle]', error)
        }
    }

    


    return (
        <AuthContext.Provider
            value={{
                ...state,

                //methods
                login,
                logout,
                loginWithGoogle
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};