/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { NetworkProvider, NetworkConsumer, useIsConnected } from 'react-native-offline';
import NetInfo from "@react-native-community/netinfo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  View,
  Modal,
  RefreshControl,
} from 'react-native';


const Premium_history = () => {

  const pol_arry = [];
  const [open, setOpen] = useState(false);
  const [policyData, setpolicyData] = useState(null);
  const [modelkey, setmodeldata] = useState(null);
  const [deletekey, setdeletekey] = useState(null);

  const modelkeyset = (key) => {
    setmodeldata(policyData[key]);
    console.log(modelkey)
  }


  const Premium_drails = async () => {
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
        setpolicyData(polcydeatils);
      }

    });
    setpolicyData(pol_arry);
  }
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      Premium_drails();
      setRefreshing(false);
    }, 2000);
  }, []);

  const delete_polcy = async (val) => {
    uid = await AsyncStorage.getItem('Uid');
    const ids = [];
    await firestore()
    .collection('policy_deatils')
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
    .collection('policy_number')
    .doc(ids[0])
    .delete()
    .then(() => {
      Alert.alert(
        'Policy Deleted!',
        'Policy has been Deleted successfully.'
      );
    });

  }


  useEffect(() => {
    Premium_drails();
  }, []);

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c4dfe6' }}>
      <SafeAreaView style={{ flex: 2 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}>

          {
            policyData != null ?
              policyData.map((policyData, key) => {
                return (
                  <View key={key}>
                    <LinearGradient
                      colors={['#01ab9d', '#66a5ad']}
                      style={styles.opci}
                    >
                      <View style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Policy :</Text>
                        <Text style={styles.menuItemTexttwo}>{policyData.policy_number}</Text>
                        <Text style={styles.menuItemTextleft}>Paid Amount :</Text>
                        <Text style={styles.menuItemTexttwo}>{policyData.collected}</Text>
                      </View>
                      <View style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Status :</Text>
                        <Text style={styles.menuItemTexttwo}>{policyData.Status}</Text>
                        <Text style={styles.menuItemTextleft}>Date :</Text>
                        <Text style={styles.menuItemTexttwo}>{policyData.Date}</Text>
                      </View>

                      <View style={styles.menuItem}>

                        <TouchableOpacity
                          style={styles.signIn}
                          onPress={() => { modelkeyset(key), setOpen(true) }}
                        >
                          <LinearGradient
                            colors={['#003b46', '#01ab9d']}
                            style={styles.signIn}
                          >
                            <Text style={[styles.textSign, {
                              color: '#fff'
                            }]}><MaterialCommunityIcons name="eye" color="#fff" size={25} /></Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.signIntwo}
                          onPress={() => {
                            setdeletekey(policyData.policy_number), delete_polcy(policyData.policy_number)
                          }}
                        >
                          <LinearGradient
                            colors={['#003b46', '#01ab9d']}
                            style={styles.signIntwo}
                          >
                            <Text style={[styles.textSign, {
                              color: '#fff'
                            }]}><MaterialCommunityIcons name="trash-can" color="#fff" size={25} /></Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>

                    <Modal visible={open} transparent={true}>
                      <View style={styles.modalview}>
                        <View style={styles.modalviewinside}>
                          <Text style={{ color: '#fff', marginLeft: 0, fontWeight: '600', fontSize: 20, lineHeight: 26, justifyContent: 'center', marginLeft: 110, marginTop: 20, marginBottom: 10 }}>{modelkey ? modelkey.policy_number || 'No data added.' : ''}</Text>
                          <View style={styles.menuItem}>
                            <MaterialCommunityIcons name="rename-box" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Name : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Name || 'No data added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <MaterialCommunityIcons name="ev-plug-type1" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Insurance Type : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Type || 'No data added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <FontAwesome name="money" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Tolal Amount : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Tolal || 'No data added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <FontAwesome name="hand-o-right" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Installments : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Installments || 'No data added.' : ''} installments</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <FontAwesome name="cc-mastercard" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Collected : </Text>
                            <Text style={styles.menuItemTextModel}>Rs.{modelkey ? modelkey.collected || 'No data added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <MaterialCommunityIcons name="update" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Date : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Date || 'No data added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <MaterialCommunityIcons name="calendar-blank-outline" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Balance : </Text>
                            <Text style={styles.menuItemTextModel}>Rs.{modelkey ? modelkey.Balance || 'No employee id added.' : ''}</Text>
                          </View>
                          <View style={styles.menuItem}>
                            <MaterialCommunityIcons name="checkbox-multiple-blank-outline" color="#fff" size={25} />
                            <Text style={styles.menuItemTextModel}>  Status : </Text>
                            <Text style={styles.menuItemTextModel}>{modelkey ? modelkey.Status || 'No employee id added.' : ''}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.signIntree}
                            onPress={() => { setOpen(false) }}
                          >
                            <LinearGradient
                              colors={['#003b46', '#01ab9d']}
                              style={styles.signIntree}
                            >
                              <Text style={[styles.textSign, {
                                color: '#fff',
                                fontSize: 15
                              }]}>Close</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                )
              }) : <View>

              </View>
          }
        </ScrollView>
      </SafeAreaView>
    </View>

  );
};

const styles = StyleSheet.create({
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
    marginLeft: 50,
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
    marginLeft: 40,
  },
  signIntwo: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 60,
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
    backgroundColor: '#003b46',
    borderRadius: 60,
  },
});


export default Premium_history;
