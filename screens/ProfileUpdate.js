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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';

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
  RefreshControl,
} from 'react-native';


const User_update = ({ navigation }) => {

  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  

  const getUser = async() => {
    uid = await AsyncStorage.getItem('Uid');
    const currentUser = await firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  const handleUpdate = async() => {
    console.log('3');
    let ImgUrl = await uploadImage();
    console.log(ImgUrl);
    if( ImgUrl == null && userData.imgUrl ) {
      ImgUrl = userData.imgUrl;
    }
    uid = await AsyncStorage.getItem('Uid');
    console.log(uid);
    console.log('5');
    console.log(userData);
    firestore()
    .collection('users')
    .doc(uid)
    .update({
      branch: userData.branch,
      email: userData.email,
      emplyID: userData.emplyID,
      name: userData.name,
      nic: userData.nic,
      phone: userData.phone,
      salcat: userData.salcat,
      vehinumber: userData.vehinumber,
      imgUrl: ImgUrl,
    })
    .then(() => {
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.'
      );
      navigation.navigate('ProfileScreen')
    })
    
    .catch(error => {
      console.log(error);
  })

    console.log('6');
  }
  const takePhotoFromCamera = () => {
    
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
      console.log(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  const uploadImage = async () => {
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    setUploading(true);


    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    const url = storage().ref(filename).putFile(uploadUri);

    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferreded of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });
    console.log('1');

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);
      console.log('2');
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };
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

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );


  bs = React.createRef();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      >
    <View style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, -5]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:20,
            }}>
            <ImageBackground
              source={{
                uri: userData
                  ? userData.imgUrl ||
                  'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f'
                  : 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f',
              }}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="camera"
                  size={35}
                  color="#07575b"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#07575b',
                    borderRadius: 10,
                  }}
                />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, fontSize: 25, fontWeight: 'bold' }}>
          {userData ? userData.name : ''}
        </Text>
        {/* <Text>{user.uid}</Text> */}
      </View>

      <View style={styles.action}>
        <FontAwesome name="user" color="#07575b" size={25} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={userData ? userData.name : ''}
          onChangeText={(txt) => setUserData({ ...userData, name: txt })}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <FontAwesome name="id-badge" color="#07575b" size={25} />
        <TextInput
          placeholder="NIC"
          placeholderTextColor="#666666"
          value={userData ? userData.nic : ''}
          onChangeText={(txt) => setUserData({ ...userData, nic: txt })}
          autoCorrect={false}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <MaterialCommunityIcons name="email" color="#07575b" size={25} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666666"
          value={userData ? userData.email : ''}
          onChangeText={(txt) => setUserData({ ...userData, email: txt })}
          autoCorrect={false}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <FontAwesome name="id-card-o" color="#07575b" size={25} />
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Emply ID"
          placeholderTextColor="#666666"
          value={userData ? userData.emplyID : ''}
          onChangeText={(txt) => setUserData({ ...userData, emplyID: txt })}
          autoCorrect={true}
          style={[styles.textInput, { height: 40 }]}
        />
      </View>
      <View style={styles.action}>
        <Feather name="phone" color="#07575b" size={25} />
        <TextInput
          placeholder="Phone"
          placeholderTextColor="#666666"
          keyboardType="number-pad"
          autoCorrect={false}
          value={userData ? userData.phone : ''}
          onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
          style={styles.textInput}
        />
      </View>

      <View style={styles.action}>
        <MaterialCommunityIcons name="office-building-marker" color="#07575b" size={25} />
        <TextInput
          placeholder="Branch"
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={userData ? userData.branch : ''}
          onChangeText={(txt) => setUserData({ ...userData, branch: txt })}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <FontAwesome
          name="user-secret"
          color="#07575b"
          size={25}
        />
        <TextInput
          placeholder="Salary category"
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={userData ? userData.salcat : ''}
          onChangeText={(txt) => setUserData({ ...userData, salcat: txt })}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <FontAwesome
          name="car"
          color="#07575b"
          size={25}
        />
        <TextInput
          placeholder="vehicle number"
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={userData ? userData.vehinumber : ''}
          onChangeText={(txt) => setUserData({ ...userData, vehinumber: txt })}
          style={styles.textInput}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          style={styles.signIn}
          onPress={() => { handleUpdate() }}
        >
          <LinearGradient
            colors={['#07575b', '#01ab9d']}
            style={styles.signIn}
          >
            <Text style={[styles.textSign, {
              color: '#fff'
            }]}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
    </SafeAreaView>
  );
};




export default User_update;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4dfe6',
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
    backgroundColor: '#66a5ad',
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
    backgroundColor: '#003b46',
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
    paddingRight:30,
    marginRight:30,
    color: '#333333',
    fontSize:15,
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