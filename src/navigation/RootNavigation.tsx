import { NavigationContainer } from '@react-navigation/native';
import { BottomTab } from './BottomTab';
import { AuthStack } from './AuthStack';
import { useContextAuth } from '../context/auth';


export const RootNavigation = () => {
    const { user } = useContextAuth()

    return (
        <NavigationContainer>
            {
                user ? <BottomTab /> : <AuthStack />
            }
        </NavigationContainer>
    )
}