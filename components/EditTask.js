import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Dialog, Portal, TextInput } from 'react-native-paper'
import MultiSelect from 'react-native-multiple-select'
import Button from './Button'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react'
import moment from 'moment'
import { DatePickerModal } from 'react-native-paper-dates'
import { useEffect } from 'react'

const EditTask = ({ show, toggleShowEditTask, categories, selectedCategory, 
    taskDescription, notificationTime, editTask, taskId, startD, endD,deleteTask }) => {
    const [taskID, setTaskID] = useState(taskId);
    const [task, setTask] = useState(null);
    const hideDialog = () => setVisible(false);
    const [selectedItems, setSelectedItems] = useState(selectedCategory);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
        console.log(selectedItems);
    };
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showTime, setShowTime] = useState(false);

    const onChange = (event, selectedDate) => {
        console.log(selectedDate.getHours(), selectedDate.getMinutes());
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShowTime(true);
        setMode(currentMode);
    };
    const showTimepicker = () => {
        console.log('time picker');
        showMode('time');
    };


    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
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
        setTask(taskDescription)
        setDate(new Date(notificationTime));
        setStartDate(new Date(startD))
        setEndDate(new Date(endD))
        setTaskID(taskId)
    }, [taskDescription, notificationTime, startD, endD,taskId])

    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShowEditTask}>
                <Dialog.Title style={styles.title}>Task detail</Dialog.Title>
                <Dialog.ScrollArea>
                    <MultiSelect
                        items={categories}
                        uniqueKey="id"
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems != null ? selectedItems : selectedCategory}
                        selectText="Select category"
                        searchInputPlaceholderText="Search category..."
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#1a1b1c"
                        tagBorderColor="#1a1b1c"
                        tagTextColor="#1a1b1c"
                        selectedItemTextColor="#1a1b1c"
                        selectedItemIconColor="#1a1b1c"
                        itemTextColor="#1a1b1c"
                        displayKey="category"
                        searchInputStyle={{ color: '#1a1b1c' }}
                        submitButtonColor="#560CCE"
                        submitButtonText="Submit"
                    />
                    <TextInput
                        style={{ paddingBottom: 30, paddingTop: 10 }}
                        label="Input your task detail"
                        multiline
                        numberOfLines={20}
                        mode="outlined"
                        value={task != null ? task : taskDescription}
                        onChangeText={text => setTask(text)}>
                    </TextInput>
                    <Text>Date range : {moment(startDate != null ? startDate : startD).format('L')} - {moment(endDate != null ? endDate : endD).format('L')}</Text>
                    <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                        Pick date
                    </Button>
                    <TouchableOpacity onPress={() => showTimepicker()}>
                        <Text>Notification time</Text>
                    </TouchableOpacity>
                    <Text>{moment(date).format('LLL')}</Text>
                    <DatePickerModal
                        locale="en"
                        mode="range"
                        visible={open}
                        onDismiss={onDismiss}
                        startDate={range.startDate}
                        endDate={range.endDate}
                        onConfirm={onConfirm}
                    />
                    <View style={{ width: '100%' }}>
                        {showTime && (
                            <DateTimePicker
                                style={{ width: '100%' }}
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />)}
                    </View>
                </Dialog.ScrollArea>
                <Dialog.Actions >
                    <Button onPress={toggleShowEditTask}>Cancel</Button>
                    <Button onPress={() => deleteTask(taskId)}>Delete</Button>
                    <Button onPress={() => editTask(startDate, endDate, task, selectedItems, date, taskId)}>Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default EditTask

const styles = StyleSheet.create({})