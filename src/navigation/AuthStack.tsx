import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../modules/auth/components/Login';
import LoginMethods from '../modules/auth/components/LoginMethods';
import RegisterUser from '../modules/auth/components/RegisterUser'
import ResetPassword from '../modules/auth/components/ResetPassword';

const Auth = createNativeStackNavigator();

//video https://www.youtube.com/watch?v=sLjoLujEj3E

export const AuthStack = () => {
    return (
        <Auth.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Auth.Screen
                name='LoginMetodos'
                component={LoginMethods}
            />
            <Auth.Screen
                name='Login'
                component={Login}
            />

            <Auth.Screen
                name='RegistroDeUsuarios'
                component={RegisterUser}
            />
            <Auth.Screen
                name='RestablecerPass'
                component={ResetPassword}
            />

        </Auth.Navigator>
    );
}