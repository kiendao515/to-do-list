import React, { useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications';
import { sendPasswordResetEmail, signOut } from 'firebase/auth'
import { auth, db } from '../config'
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { collection, getDocs, query, where } from 'firebase/firestore'
export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);
  let logout = () => {
    signOut(auth).then(() => {
      navigation.popToTop();
    });
  };
  let changePass = async()=>{
    Alert.alert("Your verification password is sent to your gmail!")
    await sendPasswordResetEmail(auth, auth.currentUser.email);
  }
  let fetchDataProfile = async () => {
    const q = query(collection(db, "users"), where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    data.forEach((doc) => {
      let user = doc.data();
      setUser(user)
      console.log(user);
    });
  }
  useEffect(() => {
    fetchDataProfile()
  }, [])
  if (!user) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Image
        style={styles.avatar}
        source={{ uri: user?.avatarUrl }}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.info}>{user.email}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={()=>changePass()}>
            <Text>Change password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={()=>logout()}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#8872ed',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    // flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#8872ed',
  },
})