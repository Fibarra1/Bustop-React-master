import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../modules/auth/components/Login';
import LoginMethods from '../modules/auth/components/LoginMethods';
import RegisterUser from '../modules/auth/components/RegisterUser'
import ResetPassword from '../modules/auth/components/ResetPassword';
import RoutesScreen from '../modules/routes/components/RoutesScreen';
import { ChoferScreen } from '../modules/routes/components/ChoferScreen';
import { RouteScreen } from '../modules/routes/components/RouteScreen';
import { ReportScreen } from '../modules/routes/components/ReportScreen';
import LoginDrivers from '../modules/auth/components/LoginDrivers';


//video https://www.youtube.com/watch?v=sLjoLujEj3E

export const AuthStack = () => {
    const Auth = createNativeStackNavigator();
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
            <Auth.Screen
                name='Routes'
                component={RoutesScreen}
            />
            <Auth.Screen
                name='Chofer'
                component={ChoferScreen}
            />
            <Auth.Screen
                name='Home3'
                component={RouteScreen}
            />
            <Auth.Screen
                name='Report'
                component={ReportScreen}
            />
            <Auth.Screen
                name='Drivers'
                component={LoginDrivers}
            />

        </Auth.Navigator>
    );
}