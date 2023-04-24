import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import { Text } from 'react-native-paper'

export default function ActivateAccountScreen({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Your account isn't activated.
      </Header>
      <Text>Please verify activation link sent to your email</Text>
    </Background>
  )
}
