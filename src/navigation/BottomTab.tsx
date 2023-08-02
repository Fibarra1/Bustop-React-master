import { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RoutesScreen from "../modules/routes/components/RoutesScreen";
import SelectRouteScreen from "../modules/select-route/components/SelectRouteScreen";
import SettingsScreen from "../modules/settings/components/SettingsScreen";

import IonIcon from "react-native-vector-icons/Ionicons";
import FontistoIcon from "react-native-vector-icons/Fontisto";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import globalStyles from "../styles/GlobalStyles";
import { useOrientation } from "../hooks/useOrientation";
import { RouteScreen } from "../modules/routes/components/RouteScreen";
import auth from '@react-native-firebase/auth';




export const BottomTab = () => {
    const Tab = createBottomTabNavigator();
    const user = auth().currentUser;
    const { isPortrait } = useOrientation();

    const iconSize: number = useMemo(() => isPortrait ? 40 : 25, [isPortrait])


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: globalStyles.colors.primary,
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: {
                    display: 'none'
                },
                tabBarInactiveTintColor: '#fff',
                tabBarActiveTintColor: 'red',
            }}
        >
            <Tab.Screen name="Routes" component={RoutesScreen} options={{
                tabBarIcon: ({ color }) => <IonIcon name="home-sharp" size={iconSize} color={color} />

            }} />
            <Tab.Screen name="Select Route" component={SelectRouteScreen} options={{
                tabBarIcon: ({ color }) => <FontAwesome5Icon name="bus" size={iconSize} color={color} />

            }} />
            <Tab.Screen name="Home3" component={RouteScreen} options={{
                tabBarIcon: ({ color }) => <FontAwesome5Icon name="route" size={iconSize} color={color} />

            }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{
                tabBarIcon: ({ color }) => <FontAwesomeIcon name="gear" size={iconSize} color={color} />

            }} />

        </Tab.Navigator>
    )
}