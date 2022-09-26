/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect,useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabScreen from './screens/MainTabScreen';
import { DrawerContent } from './screens/DrewerDetails';
import RootStackScreen from './screens/RootStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './components/context';
import NetInfo from "@react-native-community/netinfo";
import ProfileUpdate from './screens/ProfileUpdate';
import PremiumAdd from './screens/PremiumAdd';
import Premium_task from './screens/Premium_task';
import firestore from '@react-native-firebase/firestore';
const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator();



const App = () => {

  const [userData, setUserData] = useState(null);
  const [policyData, setpolicyData] = useState(null);
  const [taskdata, settaskdata] = useState(null);


  const Premium_drails = async () => {
    const pol_arry = [];
    uid = await AsyncStorage.getItem('Uid');
    await firestore()
      .collection('policy_deatils')
      .where('user', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(documentSnapshot => {
          pol_arry.push(documentSnapshot.data());
        });
        console.log(pol_arry);
        setpolicyData(policyData);
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            AsyncStorage.setItem('polcydeatils', JSON.stringify(pol_arry));
          }
        });
      })
      .catch(error => {
        console.log(error)
      }) 
  }

  const getTask = async () => {
    const task_array = [];
    uid = await AsyncStorage.getItem('Uid');
    await firestore()
      .collection('Task')
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        querySnapshot.forEach(documentSnapshot => {
          console.log(documentSnapshot.data());
          task_array.push(documentSnapshot.data());
        });
        settaskdata(task_array);
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            AsyncStorage.setItem('tasks', JSON.stringify(task_array));
            console.log(uid);
          }

        });
      })
      .catch(error => {
        console.log(error)
      }) 
  }



  const getUser = async () => {
    uid = await AsyncStorage.getItem('Uid');
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              AsyncStorage.setItem('profiledata', JSON.stringify(documentSnapshot.data()));
            }
          });

        }
      })
      .catch(error => {
        console.log(error)
      }) 
  
  }
  
  

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {

      const userName = String(foundUser[0]);
      const userToken = String(foundUser[1]);
      const Uid = foundUser[2];

      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('Uid', Uid);
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async () => {

      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('Uid');
        await AsyncStorage.removeItem('polcydeatils');
        await AsyncStorage.removeItem('profiledata');
        await AsyncStorage.removeItem('tasks');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
    },
  }), []);




  useEffect(() => {
    setTimeout(async () => {
      getUser();
      getTask();
      Premium_drails();
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        console.log(userToken);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }



  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer >

        {loginState.userToken !== null ? (
          <Drawer.Navigator initialRouteName='Home' drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={MainTabScreen}
              options={{
                drawerStyle: {
                  backgroundColor: '#c4dfe6',
                  width: 240,
                },
                title: 'Premium Collector',
                headerStyle: {
                  backgroundColor: '#07575b',
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center'
              }} />
              <Drawer.Screen name="ProfileUpdate" component={ProfileUpdate}
               options={{
                drawerStyle: {
                  backgroundColor: '#c4dfe6',
                  width: 240,
                },
                title: 'Profile update',
                headerStyle: {
                  backgroundColor: '#07575b',
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center'
              }}
              />
              <Drawer.Screen name="Premium_task" component={Premium_task}
               options={{
                drawerStyle: {
                  backgroundColor: '#c4dfe6',
                  width: 240,
                },
                title: 'New Collection  Task ',
                headerStyle: {
                  backgroundColor: '#07575b',
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center'
              }}
              />
              <Drawer.Screen name="PremiumAdd" component={PremiumAdd}
               options={{
                drawerStyle: {
                  backgroundColor: '#c4dfe6',
                  width: 240,
                },
                title: 'New Policy ',
                headerStyle: {
                  backgroundColor: '#07575b',
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center'
              }}
              />
          </Drawer.Navigator>
        )
          :
          <RootStackScreen />
        }
      </NavigationContainer>
      
    </AuthContext.Provider>
  );
};




export default App;
