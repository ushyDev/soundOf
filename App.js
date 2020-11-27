import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './screen/Main'
import firebase from "firebase";
import {AppLoading} from 'expo'
import * as Font from 'expo-font'

const fetchFonts = () => {
  return Font.loadAsync({
    rubikMedium: require('./assets/fonts/Rubik-Medium.ttf'),
    rubikRegular: require('./assets/fonts/Rubik-Regular.ttf'),
    rubikLight: require('./assets/fonts/Rubik-Light.ttf'),
    archive: require('./assets/fonts/ArchivoBlack-Regular.ttf')

  })
}


var config = {
  apiKey: "AIzaSyBaKbLk2kZa2-gS-K-aPk-CEdsFklzkS1s",
    authDomain: "sectwo-6b341.firebaseapp.com",
    databaseURL: "https://sectwo-6b341.firebaseio.com",
    projectId: "sectwo-6b341",
    storageBucket: "sectwo-6b341.appspot.com",
    messagingSenderId: "299797623692",
    appId: "1:299797623692:web:d92dd894af7d088b029ca9",
    measurementId: "G-Q8L30V01NT"
};
firebase.initializeApp(config);

export default function App() {

  const [dataLoaded, setDataLoaded] = useState(false);

  if(!dataLoaded){
    return <AppLoading
    startAsync={fetchFonts}
    onFinish={() => setDataLoaded(true)}
    onError={(err) => console.log(err) }
    />
  }


  return (
    <View style={styles.container}>
   <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
