import { FC, type ReactNode, useReducer, useContext, } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthContext, authReducer } from './';
import type { User } from '../../interfaces/user.interface';
import type { UserFromGoogle } from '../../interfaces/google_user.interface';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import {Alert} from 'react-native'

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


    const login = (user) => {
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
            const userCredential = await auth().signInWithCredential(googleCredential);

            const user = userCredential.user;
            
            login(user);
        } catch (error) {
            console.log('[desde loginWithGoogle]', error)
        }
    }

    const loginWithFacebook = async () => {
        try {
          // Solicitar los permisos necesarios para obtener el token de acceso de Facebook
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
          if (result.isCancelled) {
            throw new Error('Inicio de sesión con Facebook cancelado.');
          }
      
          // Obtener el token de acceso de Facebook
          const data = await AccessToken.getCurrentAccessToken();
          
          if (!data) {
            throw new Error('No se pudo obtener el token de acceso de Facebook.');
          }
      
          // Crear una credencial de Facebook con el token
          const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
          // Iniciar sesión con la credencial
          const userCredential = await auth().signInWithCredential(facebookCredential);
          
          // Acceder al usuario
          const user = userCredential.user;
          
          // Realizar acciones adicionales después del inicio de sesión exitoso
          login(user);
        } catch (error) {
          console.log('[desde loginWithFacebook]', error);
        }
      }

      const loginWithEmail = (email, password) => {
        auth()
          .signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // El usuario ha iniciado sesión exitosamente
            const user = userCredential.user;
            console.log('Usuario autenticado:', user.uid);
            login(user);
          })
          .catch((error) => {
            // Hubo un error durante la autenticación
            Alert.alert('Error al Iniciar Sesión', 'El correo electrónico o contraseña que ingresaste es incorrecto. Por favor, intenta nuevamente.');
            console.log('Error al iniciar sesión:', error);
          });
      };

    


    return (
        <AuthContext.Provider
            value={{
                ...state,

                //methods
                login,
                logout,
                loginWithGoogle,
                loginWithFacebook,
                loginWithEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};