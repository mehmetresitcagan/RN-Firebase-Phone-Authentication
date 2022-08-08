import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SuccessScreen from './screens/SuccessScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import InputOTPScreen from './screens/InputOTPScreen';
import UnsuccessScreen from './screens/UnsuccessScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentication">
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{title: 'Başarılı giriş', headerBackTitle: ''}}
        />
        <Stack.Screen name="Authentication" component={AuthenticationScreen} />
        <Stack.Screen
          name="InputOTP"
          component={InputOTPScreen}
          options={{title: 'Kod Giriş', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Unsuccess"
          component={UnsuccessScreen}
          options={{title: 'Başarısız giriş', headerBackTitle: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
