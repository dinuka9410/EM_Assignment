
import React, { useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import { AuthProvider } from '../components/AuthProvider';
import { AuthContext } from '../components/context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';




// import Users from '../model/users';

const SignInScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        fullname: '',
        secondpassword: '',
        check_textInputChange: false,
        check_textInputChangeFull: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        iscnfrmPassword: true,

    });

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);


    const loginHandle = (userName, password, fullname) => {


        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (data.username.length != 0 || data.password.length != 0) {
            console.log('1');
            auth()
                .createUserWithEmailAndPassword(userName, password)
                .then((data) => {
                    firestore().collection('users').doc(auth().currentUser.uid)
                        .set({
                            emplyID: '',
                            branch: '',
                            email: userName,
                            imgUrl: 'https://firebasestorage.googleapis.com/v0/b/fir-epc.appspot.com/o/profile-male.jpg?alt=media&token=bb26bd64-78f1-4269-b9d4-27d0eca6a58f',
                            name: fullname,
                            nic: '',
                            phone: '',
                            vehinumber: '',
                            salcat:''
                        })
                        .then((data) => {
                            navigation.navigate('SignInScreen')
                            console.log(data);
                            console.log('2');
                        })
                        .catch(error => {
                            Alert.alert('Wrong Input!', error, [
                                { text: 'Okay' }
                            ]);
                        })
                        console.log('3');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert('Wrong Input!','That email address is already in use!', [
                            { text: 'Okay' }
                        ]);
                    }

                    if (error.code === 'auth/invalid-email') {
                        Alert.alert('Wrong Input!','That email address is invalid!', [
                            { text: 'Okay' }
                        ]);
                    }

                    
                });
                
        }
    }



    const textInputChange = (val) => {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (pattern.test(String(val).toLowerCase())) {

            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const textInputChange_full = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                fullname: val,
                check_textInputChangeFull: true,

            });
        } else {
            setData({
                ...data,
                fullname: val,
                check_textInputChangeFull: false,

            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }
    const handlePasswordChange_conrm = (val) => {
        if (data.password == val) {
            setData({
                ...data,
                secondpassword: val,
                iscnfrmPassword: true
            });
        } else {
            setData({
                ...data,
                secondpassword: val,
                iscnfrmPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#07575b' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Full name</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Enter Your Full Name"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange_full(val)}
                    />
                    {data.check_textInputChangeFull ?
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>

                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 15
                }]}>Email</Text>

                <View style={styles.action}>
                    <FontAwesome
                        name="envelope-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Enter Your Email"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                    />
                    {data.check_textInputChange ?
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid Email</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 15

                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {data.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </Animatable.View>
                }

                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 15

                }]}>Confrom Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="unlock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange_conrm(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {data.iscnfrmPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password Not Match</Text>
                    </Animatable.View>
                }


                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { loginHandle(data.username, data.password, data.fullname) }}
                    >
                        <LinearGradient
                            colors={['#07575b', '#01ab9d']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Register</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={[styles.signIn, {
                            borderColor: '#07575b',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#07575b'
                        }]}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07575b'
    },
    header: {
        flex: 0.25,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});


