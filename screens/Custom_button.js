import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableOpacity,
  Switch
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const Custom_buttons=(props) =>{


  return (
    <TouchableOpacity
      style={styles.signIntree}
      onPress={() => { props.action }}
    >
      <LinearGradient
        colors={['#003b46', '#01ab9d']}
        style={styles.signIntree}
      >
        <Text style={[styles.textSign, {
          color: '#fff',
          fontSize: 15
        }]}>{props.Title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
export default Custom_buttons;

const styles = StyleSheet.create({
  signIntree: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 80,
    marginTop: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
}
});