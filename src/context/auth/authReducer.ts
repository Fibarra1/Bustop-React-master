import { User } from '../../interfaces/user.interface';
import { UserFromGoogle } from '../../interfaces/google_user.interface';
import { AuthStateProps } from './';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';


type AuthActionType = 
  { type: '[Auth] - Login', payload: User | UserFromGoogle | FirebaseAuthTypes.UserCredential } 
| { type: '[Auth] - Logout' };

export const authReducer = (state: AuthStateProps, action: AuthActionType):AuthStateProps => {
    switch (action.type) {
        case '[Auth] - Login':
            return { ...state, user: action.payload };
        case '[Auth] - Logout':
            return { ...state, user: null };
        default:
            return state;
    }
}