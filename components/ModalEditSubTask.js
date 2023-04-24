import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Dialog, Portal, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import Button from './Button';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect } from 'react';
import moment from 'moment';
const ModalEditSubTask = ({ show, toggleShow, editSubTask,
    parentTaskId ,subtask,startD,endD,taskId,deleteSubTask,object}) => {
    const [task, setTask] = useState(subtask);
    const hideDialog = () => setVisible(false);
    const [startDate, setStartDate] = useState(startD);
    const [endDate, setEndDate] = useState(endD);
    const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = React.useState(false);
    const [subTaskId, setSubTaskId] = useState(null)
    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);
    const onConfirm = useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
            console.log(startDate, endDate);
            setEndDate(endDate);
            setStartDate(startDate);
        },
        [setOpen, setRange]
    );
    useEffect(() => {
        setTask(subtask)
        setStartDate(new Date(startD))
        setEndDate(new Date(endD))
        setSubTaskId(object)
    }, [subtask, startD, endD])
    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title style={styles.title}>Sub task detail</Dialog.Title>
                <Dialog.ScrollArea>
                    <TextInput
                        style={{ paddingBottom: 30, paddingTop: 10 }}
                        multiline
                        numberOfLines={20}
                        mode="outlined"
                        value={task !=null ? task:subtask}
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
                <Text style={{marginLeft:20}}>Date : {moment(startDate != null ? startDate : startD).format('L')} - {moment(endDate!=null ? endDate: endD).format('L')}</Text>
                <TouchableOpacity onPress={() => setOpen(true)} uppercase={false} style={{ marginLeft: 20,display:'flex' ,alignItems:'baseline'}}>
                    <Text>Choose date</Text>
                    <Icon name={'access-time'} size={18} style={{ paddingTop: -20 }} />
                </TouchableOpacity>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={() => deleteSubTask(parentTaskId,taskId)}>Delete</Button>
                    <Button onPress={() => {
                        editSubTask(startDate!=null ? startDate:startD, endDate!=null ? endDate:endD, parentTaskId, subTaskId,task!=null? task: subtask)
                    }}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalEditSubTask

const styles = StyleSheet.create({})