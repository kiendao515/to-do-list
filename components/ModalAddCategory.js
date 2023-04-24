import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Portal } from 'react-native-paper'
import Button from './Button';
const ModalAddCategory = ({ show, toggleShow, addCategory, title, cate }) => {
   // console.log(cate);
    const [category, setCategory] = useState(cate);
    const hideDialog = () => setVisible(false);
    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title style={styles.title}>{title}</Dialog.Title>
                <Dialog.ScrollArea>
                    <TextInput
                        style={{ paddingBottom: 30 }}
                        label="Input your category"
                        multiline
                        numberOfLines={20}
                        mode="outlined"
                        placeholder='Input here'
                        defaultValue={cate}
                        onChangeText={text => {
                            setCategory(text)
                        }}>
                    </TextInput>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={() => {
                        addCategory(category)
                    }}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalAddCategory

const styles = StyleSheet.create({})