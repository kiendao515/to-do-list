import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Portal, Switch } from 'react-native-paper'
import Button from './Button';
import MultiSelect from 'react-native-multiple-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Colors } from './Colors';
import Icon from "react-native-vector-icons/MaterialIcons";
const ModalAddSubTask = ({ show, toggleShow, addSubTask,parentTaskId }) => {
    const [task, setTask] = useState("");
    const hideDialog = () => setVisible(false);
    const [startDate,setStartDate] = useState(null);
    const [endDate,setEndDate] = useState(null);
    const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = React.useState(false);
    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);
    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
            console.log(startDate,endDate);
            setEndDate(endDate);
            setStartDate(startDate);
        },
        [setOpen, setRange]
    );


    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title style={styles.title}>Create new sub task</Dialog.Title>
                <Dialog.ScrollArea>
                    <TextInput
                        style={{ paddingBottom: 30, paddingTop: 10 }}
                        label="Your task detail"
                        multiline
                        numberOfLines={20}
                        mode="outlined"
                        placeholder='Your task detail'
                        onChangeText={text => setTask(text)}>
                    </TextInput>
                    {/* <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                        Pick range
                    </Button> */}
                    <DatePickerModal
                        locale="en"
                        mode="range"
                        visible={open}
                        onDismiss={onDismiss}
                        startDate={range.startDate}
                        endDate={range.endDate}
                        onConfirm={onConfirm}
                    />
                </Dialog.ScrollArea>
                <TouchableOpacity onPress={() => setOpen(true)} uppercase={false} style={{marginLeft:20}}>
                        <Text>Pick date <Icon name={'access-time'} size={18} style={{paddingTop:-10}}/></Text>
                </TouchableOpacity>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={() => addSubTask(startDate,endDate,parentTaskId,task)}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalAddSubTask;

const styles = StyleSheet.create({})