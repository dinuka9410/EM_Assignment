/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from '../components/context';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableRipple,
  Text,
  Image,
  useColorScheme,
  View,
  RefreshControl,
} from 'react-native';
import ProfileUpdate from './ProfileUpdate';

const User_profile = ({ navigation }) => {

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
          console.log('User Data', documentSnapshot.data());

        }
      })

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        AsyncStorage.setItem('profiledata', JSON.stringify(userData));
      } else {
        profiledata = AsyncStorage.getItem('profiledata');
        setUserData(profiledata);
      }

    });

  }
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      getUser();
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#b897ff' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{ uri: userData ? userData.imgUrl || 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f' : 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f' }}
        />
        <Text style={styles.userName}>{userData ? userData.name || 'first name' : 'last name'}</Text>
        <Text style={styles.aboutUser}>
          {userData ? userData.emplyID || 'No employee id added.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          <>
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() => {
                navigation.navigate('ProfileUpdate');
              }}>
              <Text style={styles.userBtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => signOut()}>
              <Text style={styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
          </>
        </View>

        <View style={styles.menuWrapper}>
          <TouchableOpacity style={styles.opci}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="email-multiple-outline" color="#07575b" size={25} />
              <Text style={styles.menuItemText}>Email :</Text>
              <Text style={styles.menuItemText}>{userData ? userData.email || 'first name' : 'last name'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opci}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="card-account-details-outline" color="#07575b" size={25} />
              <Text style={styles.menuItemText}>NIC No:</Text>
              <Text style={styles.menuItemText}>{userData ? userData.nic || 'No NIC added' : 'last name'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opci}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="phone-dial-outline" color="#07575b" size={25} />
              <Text style={styles.menuItemText}>Phone :</Text>
              <Text style={styles.menuItemText}>{userData ? userData.phone || 'No Phone added' : 'last name'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opci} >
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="car" color="#07575b" size={25} />
              <Text style={styles.menuItemText}>Vehicle :</Text>
              <Text style={styles.menuItemText}>{userData ? userData.vehinumber || 'No Branch added' : 'last name'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opci}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="credit-card-refresh-outline" color="#07575b" size={25} />
              <Text style={styles.menuItemText}>Salary  :</Text>
              <Text style={styles.menuItemText}>{userData ? userData.salcat || 'No Branch added' : 'last name'}</Text>
            </View>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};




export default User_profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4dfe6',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 25,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#07575b',
    borderWidth: 2,
    width: 120,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    alignContent: 'center',
    backgroundColor: '#07575b',
  },
  userBtnTxt: {
    color: '#fff',
    textAlign: 'center'

  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    color: '#fff',
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  opci: {
    marginTop: 5,
    backgroundColor: "#66a5ad",
    borderRadius: 10,
  },
});