import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { auth,db } from '../config'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    console.log("user logined:",auth.currentUser);
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    createUserWithEmailAndPassword(auth,email.value,password.value).then(async (userCredential)=>{
      console.log(userCredential.user);
      // await sendEmailVerification(auth.currentUser);
      // console.log(auth.currentUser);
      let user ={
        userId: auth.currentUser.uid,
        email:auth.currentUser.email,
        avatarUrl:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
        hash: Date.now(),
        name:name.value,
        otp: Math.floor(Math.random() * (999999- 100000) ) + 100000
      }
      const docRef = await addDoc(collection(db, "users"), user);
      console.log(docRef);
    }).then(async ()=>{
      await sendEmailVerification(auth.currentUser);
    }).then(async ()=>{
      navigation.navigate("LoginScreen");
      Alert.alert("Please confirm activated link to confirm your email");
    }).catch(err=>{
      console.log(err.message.replace('Firebase: Error ', ''));
      if(err.message.replace('Firebase: Error ', '')=="(auth/email-already-in-use)."){
        setEmail({...email,error:"Email is already existed"});
      }
    })
  }

  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
