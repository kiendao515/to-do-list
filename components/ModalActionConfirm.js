import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Portal } from 'react-native-paper'
import Button from './Button';
const ModalActionConfirm = ({ show, toggleShow, deleteCategory}) => {
    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title>Are you sure to delete?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={() => {
                        deleteCategory()
                    }}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalActionConfirm

const styles = StyleSheet.create({})