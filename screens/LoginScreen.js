import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View,Text, Alert } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { auth } from '../config'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  if (auth.currentUser && auth.currentUser.emailVerified) {
    navigation.navigate("Home");
  }else if(auth.currentUser && !auth.currentUser.emailVerified){
    navigation.navigate("ActivateAccountScreen")
  } 
  else {
    onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser.emailVerified) {
        navigation.navigate("Home");
      }else if(user && !auth.currentUser.emailVerified){
        navigation.navigate("ActivateAccountScreen")
        console.log("chua activated");
      }
    });
  }
  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    signInWithEmailAndPassword(auth,email.value,password.value).then((userCredential)=>{
      navigation.navigate("Home", { user: userCredential.user });
    }).catch(err=>{
      console.log(err.message.replace('Firebase: Error ', ''));
      if(err.message.replace('Firebase: Error ', '')=="(auth/wrong-password)."){
        setPassword({...password,error:"Wrong password"});
      }else if(err.message.replace('Firebase: Error ', '')=="(auth/user-not-found)."){
        console.log("zo day");
        setEmail({...email,error:"Email not found"})
      }else if(err.message.replace('Firebase: Error ', '')=="(auth/network-request-failed)."){
        setEmail({...email,error:"Network error"})
      }
    })
  }

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Header></Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})