import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Portal, Switch } from 'react-native-paper'
import Button from './Button';
import MultiSelect from 'react-native-multiple-select';
import { DatePickerModal } from 'react-native-paper-dates';
import DateTimePicker from '@react-native-community/datetimepicker';
const ModalAddTask = ({ show, toggleShow, addTask, categories }) => {
    const [category, setCategory] = useState(null);
    const [task, setTask] = useState("");
    const hideDialog = () => setVisible(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
        console.log(selectedItems);
    };
    const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showTime, setShowTime] = useState(false);

    const onChange = (event, selectedDate) => {
        console.log(selectedDate.getHours(),selectedDate.getMinutes());
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


    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title style={styles.title}>Create new task</Dialog.Title>
                <Dialog.ScrollArea>
                    <MultiSelect
                        items={categories}
                        uniqueKey="id"
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems}
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
                        value={category}
                        multiline
                        numberOfLines={20}
                        mode="outlined"
                        placeholder='Input your task detail'
                        onChangeText={text => setTask(text)}>
                    </TextInput>
                    <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                        Pick date
                    </Button>
                    <TouchableOpacity onPress={()=>showTimepicker()}>
                        <Text>Notification time</Text>
                    </TouchableOpacity>
                    <Text>{date?.getHours()}:{date?.getMinutes()}</Text>
                    <DatePickerModal
                        locale="en"
                        mode="range"
                        visible={open}
                        onDismiss={onDismiss}
                        startDate={range.startDate}
                        endDate={range.endDate}
                        onConfirm={onConfirm}
                    />
                    <View style={{width:'100%'}}>
                    {showTime && (
                        <DateTimePicker
                            style={{width:'100%'}}
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                        />)}
                    </View>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={() => addTask(startDate, endDate, task, selectedItems,date)}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalAddTask;

const styles = StyleSheet.create({})