import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-native-paper";
import { theme } from "./core/theme";
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import StartScreen from "./screens/StartScreen";
import { LogBox } from 'react-native';
import ActivateAccountScreen from "./screens/ActivateAccountSreeen";
import ManageCategory from "./screens/ManageCategory";
import {
    en,
    registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en', en)
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state', 'syncStorage has been extracted from react-native core and will be removed in a future release', 'Warning: Each child in a list should have a unique "key" prop']);
const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <Provider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="LoginScreen"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="StartScreen" component={StartScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="ActivateAccountScreen" component={ActivateAccountScreen} />
                    <Stack.Screen name="Home"
                        screenOptions={{
                            headerShown: false,
                        }}
                        component={Home} />
                    <Stack.Screen
                        name="ResetPasswordScreen"
                        component={ResetPasswordScreen}

                    />
                    <Stack.Screen
                        name="ManageCategory"
                        component={ManageCategory} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}