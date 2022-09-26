import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import firestore from '@react-native-firebase/firestore';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import { AuthContext } from '../components/context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function DrawerContent(props) {

  const paperTheme = useTheme();

  const { signOut, toggleTheme } = React.useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const getUser = async () => {
    uid = await AsyncStorage.getItem('Uid');
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      })
  }
  useEffect(() => {
    getUser();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'column', marginTop: 20,justifyContent: 'center',}}>
              <Avatar.Image
                source={{
                  uri: userData
                    ? userData.imgUrl ||
                    'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f'
                    : 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f',
                }}
                size={100}
              />
              <View style={{ flexDirection: 'column' }}>
                <Title style={styles.title}>{userData ? userData.name : ''}</Title>
                <Caption style={styles.caption}>{userData ? userData.emplyID : 'Emply ID'}</Caption>
              </View>
            </View>
            
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="home-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Home"
              onPress={() => { props.navigation.navigate('HomeScreen') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="history"
                  color={color}
                  size={size}
                />
              )}
              label="History"
              onPress={() => { props.navigation.navigate('HistoryScreen') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Profile"
              onPress={() => { props.navigation.navigate('ProfileScreen') }}
            />


          </Drawer.Section>
          <Drawer.Section title="Preferences">
            {/* <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon
              name="exit-to-app"
              color={color}
              size={size}
            />
          )}
          label="Sign Out"
          onPress={() => { signOut() }}
        />
      </Drawer.Section>
    </View>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    backgroundColor:'#66a5ad',
    
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 15,
    lineHeight: 14,
    marginBottom:60
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    backgroundColor:'#66a5ad'
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});