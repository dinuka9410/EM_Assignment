import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import loginScreen from './loginScreen';
import RegistrationScreen from './RegistrationScreen';

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'
    
    >
        <RootStack.Screen name="SignInScreen" component={loginScreen}
        options={{
            drawerStyle: {
              backgroundColor: '#07575b',
              width: 240,
            },
            title: 'Esay Premium Collector',
            headerStyle: {
              backgroundColor: '#07575b',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
          }}
        />
        <RootStack.Screen name="SignUpScreen" component={RegistrationScreen}
         options={{
            drawerStyle: {
              backgroundColor: '#07575b',
              width: 240,
            },
            title: 'Esay Premium Collector',
            headerStyle: {
              backgroundColor: '#07575b',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
          }}/>
    </RootStack.Navigator>
);

export default RootStackScreen;