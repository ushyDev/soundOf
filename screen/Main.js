import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet,Image, Text, View, TouchableOpacity, Button, Dimensions, FlatList} from 'react-native';
import { Audio } from 'expo-av';
import firebase from "firebase";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const API_KEY = 'AIzaSyDNjnKGQCBwlsIlX6oqYtdO_a-4LYzEUyw';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;


async function callGoogleVisionAsync(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 1,
          },
        ],
      },
    ],
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  console.log('callGoogleVisionAsync -> result', result);
  //result.responses[0].labelAnnotations[0].description
  return result.responses[0].labelAnnotations[0].description;
}

export default function Main() {

  useEffect(() => {
    askPermissionsAsync();
    askPermissionsPhotoAsync();
    
    if(timeRec >= 3.0 && first == true){
     stopRecording();
          setFirst(false)
     }
    
  });

const db = firebase.database();

const [isRecording, setIsRecording] = useState(false);
const [recording, setRecording] = useState(null);
const [sound, setSound] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);
const [permissions, setPermissions] = useState(false);
const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [scena1, setScena1] = useState(true);
  const [scena2, setScena2] = useState(false);
  const [scena3, setScena3] = useState(false);
  const [scena4, setScena4] = useState(false);
  const [timeRec, setTimeRec] = useState(0.0);
  const [dupa, setDupa] = useState(false)
  const [first, setFirst] = useState(true)



function uuid() {
  let d = new Date().getTime();
 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
    
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
}

  const askPermissionsAsync = async () => {
    let permissionResult = await Audio.requestPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access audio is required!');
      return;
    } else {
      setPermissions(true);
    }
  };

  const askPermissionsPhotoAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    } else {
      setPermissions(true);
    }
  };

  const takePictureAsync = async () => {
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    if (!cancelled) {
      setImage(uri);
      setStatus('Loading...');
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus(result);
        console.log("Obiekty", result)
        setScena1(false)
        setScena2(true)
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    } else {
      setImage(null);
      setStatus(null);
    }
  };

const recordingSettings = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};




const startRecording = async () => {
  // stop playback
  if (sound !== null) {
    await sound.unloadAsync();
    sound.setOnPlaybackStatusUpdate(null);
    setSound(null);
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: true,
  });
  const _recording = new Audio.Recording();
  try {
    await _recording.prepareToRecordAsync(recordingSettings);
    setRecording(_recording);
    await _recording.startAsync();
    console.log("recording");
    setIsRecording(true);
    let i = 0;
    const time = setInterval(() => {
    setTimeRec(prevTimeRec => prevTimeRec + 0.1)
    i++;
    if (i >= 30) {
        clearInterval(time);
    }
}, 100);

  } catch (error) {
    console.log("error while recording:", error);
  }
};

const stopRecording = async () => {
  try {
    await recording.stopAndUnloadAsync();
  } catch (error) {
    // Do nothing -- we are already unloaded.
  }
  const info = await FileSystem.getInfoAsync(recording.getURI());
  console.log(info)
  console.log(`koniec NAGTYWANIA`);

  console.log(`FILE INFO: ${JSON.stringify(info)}`);
  console.log(`INFO URI: ${JSON.stringify(info.uri)}`);

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    playsInSilentLockedModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: true,
  });
  const { sound: _sound, status } = await recording.createNewLoadedSoundAsync(
    {
      isLooping: true,
      isMuted: false,
      volume: 1.0,
      rate: 1.0,
      shouldCorrectPitch: true,
    }
  );
  setSound(_sound);
  setIsRecording(false);
};

const uploadAudio = async () => {
  const uri = recording.getURI();
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        try {
          resolve(xhr.response);
        } catch (error) {
          console.log("error:", error);
        }
      };
      xhr.onerror = (e) => {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    if (blob != null) {
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
     const klucz = uuid();
  
      console.log(klucz)
      firebase
        .storage()
        .ref()
        .child(`${klucz}.${fileType}`)
        .put(blob, {
          contentType: `audio/${fileType}`,
        })
        .then(() => {
          console.log("Sent!");
          firebase.firestore().collection('sounds').doc(klucz).set({
    sonudOf: 'Glas',
    storage: klucz
  }).then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});
        })
        .catch((e) => console.log("error:", e));
    } else {
      console.log("erroor with blob");
    }
  } catch (error) {
    console.log("error:", error);
  }
  
  
};


const downloadAudio = async () => {
  const uri = await firebase
    .storage()
    .ref("BLABLA.m4a")
    .getDownloadURL();

  console.log("uri:", uri);

  // The rest of this plays the audio
  // const soundObject = new Audio.Sound();
  // try {
  //   await soundObject.loadAsync({ uri });
  //   await soundObject.playAsync();
  // } catch (error) {
  //   console.log("error:", error);
  // }
};

const recBut = () => {
  setScena2(false)
  setScena4(true)
}

  return (
    <View style={styles.container}>
  <Image style={{width: windowWidth, height: windowHeight + 30, position: 'absolute',}}   blurRadius={5}
 source={require('../assets/okurde.gif')} />

      {scena1 && 
      <View>
        
      <TouchableOpacity style={styles.button}  onPress={takePictureAsync} >
      <Text style={{color: '#ff6a94', fontFamily: 'archive', fontSize: 20}}>take photo.</Text>
      </TouchableOpacity> 

      </View>
      }
{scena2 &&
<View style={{justifyContent: 'center', alignItems: 'center'}}>
<Text style={{color: '#ff6a94', fontFamily: 'archive', fontSize: 20}}>{status}</Text>
<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 25}}> 
<TouchableOpacity>
<Image style={{width: 40, height: 40}}  source={require('../assets/right-arrow.png')} />
</TouchableOpacity>
<TouchableOpacity>
<Image style={{width: 70, height: 70, marginHorizontal: 25}}  source={require('../assets/play-button.png')} />
</TouchableOpacity>
<TouchableOpacity>
<Image style={{width: 40, height: 40}}  source={require('../assets/left-arrow.png')} />
</TouchableOpacity>

</View>
<TouchableOpacity onPress={recBut}>
 <Image style={{width: 60, height: 60}}  source={require('../assets/record.png')} />
</TouchableOpacity>
</View>
}
{scena4 &&
<View>
    <Text style={{color: '#ff6a94', fontFamily: 'archive', fontSize: 18}}>{timeRec.toFixed(2)}s</Text>

<TouchableOpacity  onPress={startRecording} >
 <Image style={{width: 60, height: 60}}  source={require('../assets/record.png')} />
</TouchableOpacity>
  <TouchableOpacity style={styles.button}  onPress={stopRecording} >
      <Text style={{color: 'white'}}>stop recording</Text>
      </TouchableOpacity>
</View>
}

   {scena3 &&
   <View>
      <TouchableOpacity style={styles.button}  onPress={startRecording} >
      <Text style={{color: 'white', }}>Start recording</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.button}  onPress={uploadAudio} >
      <Text style={{color: 'white'}}>Upload recordingf</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}  onPress={downloadAudio} >
      <Text style={{color: 'white'}}>DOWNLOAD</Text>
      </TouchableOpacity>
      </View>
   }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
    height: windowHeight
  },
  button:{
    marginVertical: 10,
    borderColor: '#ff6a94',
    borderWidth: 0.15,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: '#3a1855'
  }
});
