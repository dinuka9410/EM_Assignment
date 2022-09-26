

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import NetInfo from "@react-native-community/netinfo";
import { Picker } from '@react-native-picker/picker';

const HomeScreen = ({ navigation }) => {

  const [userData, setUserData] = useState(null);
  const [policyData, setpolicyData] = useState(null);
  const [totAmout, settotamout] = useState(null);
  const [taskdataE, settaskdata] = useState(null);
  const [RemainDy, setRemainDy] = useState(null);
  const [presetange, setpresetange] = useState(null);
  const [open, setOpen] = useState(false);

  const actions = [
    {
      text: "Add New Premium",
      icon: require("../images/add.png"),
      name: "New_premum",
      position: 2,
      color: '#07575b',
      overlayColor: '#fff'
    },
    {
      text: "Add Collection Task",
      icon: require("../images/add2.png"),
      name: "Task",
      position: 1,
      color: '#07575b'
    },
  ];

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
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            AsyncStorage.setItem('profiledata', JSON.stringify(userData));
          } else {
            profiledata = AsyncStorage.getItem('profiledata');
            restoredArray_pdata = JSON.parse(profiledata);
            setUserData(restoredArray_pdata);
          }
        });
      })
      .catch(error => {
        console.log(error)
      })

  }

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

      })
      .catch(error => {
        console.log(error)
      })

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        AsyncStorage.setItem('polcydeatils', JSON.stringify(pol_arry));

      } else {
        polcydeatils = AsyncStorage.getItem('polcydeatils');
        restoredArray_polcydata = JSON.parse(polcydeatils);
        setpolicyData(restoredArray_polcydata);
      }

    });
    setpolicyData(pol_arry);

    var total = 0;
    pol_arry.forEach(element => {
      var valuve = parseInt(element.collected);
      total = total + valuve;
    });
    settotamout(total);
    var prese = (total / 17500) * 100;
    setpresetange(Math.round(prese));

  }

  const getdata = async () => {

    const task_array = [];
    uid = await AsyncStorage.getItem('Uid');
    await firestore()
      .collection('Task')
      .where('sts', '!=', '1')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(documentSnapshot => {
          task_array.push(documentSnapshot.data());
        });
        settaskdata(task_array);
      })
      .catch(error => {
        console.log(error)
      })
    console.log(task_array);
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        AsyncStorage.setItem('tasks', JSON.stringify(task_array));

      } else {
        taskdata = AsyncStorage.getItem('tasks');
        restoredArray_taskdata = JSON.parse(taskdata);
        settaskdata(restoredArray_taskdata);
      }
    });
    now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();
    const remainingDays = totalDays - today;
    setRemainDy(remainingDays);


  }

  const Sts_change = async (val) => {
    uid = await AsyncStorage.getItem('Uid');
    const ids = [];
    await firestore()
    .collection('Task')
    .where('policy_number', '==', val)
    .get()
    .then(querySnapshot   => {
      querySnapshot.forEach(documentSnapshot => {
        ids.push(documentSnapshot.id);
        
      });
    })
    .catch(error => {
      console.log(error)
    })
    firestore()
    .collection('Task')
    .doc(ids[0])
    .update({
      sts: '1',
    })
    .then(() => {
      Alert.alert(
        'Task Status!',
        'Task Status has been changed successfully.'
      );
    });

  }


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      getdata();
      getUser();
      Premium_drails();
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getdata();
    getUser();
    Premium_drails();
  }, []);
 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' }}>
      <View style={styles.menuItemTOP}>
        <LinearGradient start={{ x: 0.0, y: 0.4 }} end={{ x: 0.5, y: 1.0 }} location={[0, 1]} colors={['#003b46', '#07575b']} style={{ flex: 1.2, flexDirection: 'column' }} >
          <View style={{ flexDirection: 'column', marginTop: 10, paddingHorizontal: '5%' }} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }} >
              <View style={{ flexDirection: 'column' }} >
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, color: '#fff' }} >Welcome Back</Text>
                <Text style={{ fontFamily: 'Roboto-Medium', color: '#fff', fontSize: 22 }} >{userData ? userData.name || 'first name' : 'last name'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                <Image source={{ uri: userData ? userData.imgUrl || 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f' : 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f' }} resizeMode='cover' style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 15 }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-between', alignItems: 'center' }} >
              <View style={{ flexDirection: 'column' }} >
                <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Roboto-Bold' }} >RS {totAmout}.00</Text>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Roboto-Regular-Italic', fontSize: 14 }} >{RemainDy} days to cover target</Text>
              </View>
              <View style={{ flexDirection: 'row', height: 30, width: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#66a5ad' }}  >
                <Text style={{ fontFamily: 'Roboto-Bold', color: '#fff' }} >{presetange}% </Text>
                <Icon name="chevron-circle-up" size={15} color="#fff" />
              </View>
            </View>
          </View>

        </LinearGradient>

      </View>
      <View style={styles.BottomItem}>
        <SafeAreaView style={{ flex: 2 }}>
          <Text style={{ fontFamily: 'Roboto-Bold', color: '#07575b', fontSize: 20, fontWeight: 'bold' }} >Active Tasks</Text>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />}>

            {
              taskdataE != null ?
                taskdataE.map((data, key) => {
                  return (
                    <View key={key}>
                      <LinearGradient
                        colors={['#01ab9d', '#66a5ad']}
                        style={styles.opci}
                      >
                        <View style={styles.menuItem}>
                          <Text style={styles.menuItemText}>Policy Details :</Text>
                          <Text style={styles.menuItemTexttwo}>{data.policy_number} ,</Text>
                          <Text style={styles.menuItemTexttwo}>Rs.{data.collected}.00</Text>
                          <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => {Sts_change(data.policy_number) }}
                          >
                            <LinearGradient
                              colors={['#003b46', '#01ab9d']}
                              style={styles.signIn}
                            >
                              <Text style={[styles.textSign, {
                                color: '#fff'
                              }]}><MaterialCommunityIcons name="check-all" color="#fff" size={25} /></Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </View>
                  )
                }) : <View>

                </View>
            }
          </ScrollView>
        </SafeAreaView>
        <FloatingAction color="#003b46"
          actions={actions}
          onPressItem={name => {
            if (name == "New_premum") {
              navigation.navigate('PremiumAdd');
            }
            else {
              navigation.navigate('Premium_task');
            }

          }}
        />
      </View>
    </View>

  );
};


export default HomeScreen;
const styles = StyleSheet.create({

  menuItemTOP: {
    flex: 1,
    backgroundColor: "green",
    width: '100%',
  },
  BottomItem: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: "#c4dfe6",
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 40,
    color: '#fff',
    width: '100%',
    borderRadius: 50,
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 0,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  menuItemTextleft: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  menuItemTexttwo: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  menuItemTextModel: {
    color: '#fff',
    marginLeft: 0,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  opci: {
    marginTop: 10,
    width: 400
  },

  opci: {
    marginTop: 10,
    width: 400,
    borderRadius: 20,
  },
  signIn: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  signIntwo: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  signIntree: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 80,
    marginTop: 10

  },
  modalview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalviewinside: {
    width: 350,
    height: 500,
    backgroundColor: '#66a5ad',
    borderRadius: 60,
  },
});