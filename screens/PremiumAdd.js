/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from "@react-native-community/netinfo";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  TouchableRipple,
  Text,
  Image,
  useColorScheme,
  View,
  Alert,
} from 'react-native';


const PremiumAdd = ({ navigation }) => {

  const [data, setData] = React.useState({
    Balance: '',
    Date: '',
    Installments: '',
    Name: '',
    Status: '',
    Tolal: '',
    Type: '',
    collected: '',
    policy_number: '',
    user: '',

  });

  const inter_status = () => {

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        handleUpdate();
      } else {
        Alert.alert(
          'Update failed!',
          'your currently offline.'
        );
      }

    });

  }


  const handleUpdate = async () => {


    uid = await AsyncStorage.getItem('Uid');
    console.log(data);
    await firestore()
      .collection('policy_deatils')
      .add({
        Balance: '',
        Date: '',
        Installments: data.Installments,
        Name: data.Name,
        Status: '',
        Tolal: data.Tolal,
        Type: data.Type,
        collected: '0',
        policy_number: data.policy_number,
        user: uid,
      })
      .then(() => {
        Alert.alert(
          'Policy Added!',
          'Policy has been Added successfully.'
        );
        const pol_arry = [];
        uid = AsyncStorage.getItem('Uid');
        firestore()
          .collection('policy_deatils')
          .where('user', '==', uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(documentSnapshot => {
              pol_arry.push(documentSnapshot.data());
            });
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                AsyncStorage.setItem('polcydeatils', JSON.stringify(pol_arry));
              }
            });
          })
          .catch(error => {
            console.log(error)
          })
        navigation.navigate('HomeScreen');


      })
      .catch(error => {
        console.log(error);
      });

  }
  // useEffect(() => {
  //   getUser();
  // }, []);
  return (

    <SafeAreaView style={{ backgroundColor: '#c4dfe6', flex: 1, }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.action}>
            <FontAwesome name="user" color="#07575b" size={25} />
            <TextInput
              placeholder="Customer full name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              onChangeText={(txt) => setData({ ...data, Name: txt })}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons name="format-list-numbered" color="#07575b" size={25} />
            <TextInput
              placeholder="Policy Number"
              placeholderTextColor="#666666"
              onChangeText={(txt) => setData({ ...data, policy_number: txt })}
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons name="format-list-bulleted-type" color="#07575b" size={25} />
            <TextInput
              placeholder="Policy Type"
              placeholderTextColor="#666666"
              onChangeText={(txt) => setData({ ...data, Type: txt })}
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="align-left" color="#07575b" size={25} />
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Installments"
              placeholderTextColor="#666666"
              onChangeText={(txt) => setData({ ...data, Installments: txt })}
              autoCorrect={true}
              style={[styles.textInput, { height: 40 }]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="money" color="#07575b" size={25} />
            <TextInput
              placeholder="Amount"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              autoCorrect={false}
              onChangeText={(txt) => setData({ ...data, Tolal: txt })}
              style={styles.textInput}
            />
          </View>
          {/* <Form
        Button buttonTitle="Update" onPress={handleUpdate} /> */}
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => { inter_status() }}
            >
              <LinearGradient
                colors={['#07575b', '#01ab9d']}
                style={styles.signIn}
              >
                <Text style={[styles.textSign, {
                  color: '#fff',
                  fontWeight: 'bold'
                }]}>Add</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};




export default PremiumAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4dfe6',
    marginTop: 50
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 30,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    paddingRight: 30,
    marginRight: 30,
    color: '#333333',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});