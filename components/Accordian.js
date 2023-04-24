import React, { useState } from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, LayoutAnimation, Platform, UIManager, Alert } from "react-native";
import { Colors } from './Colors';
import Icon from "react-native-vector-icons/MaterialIcons";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { useEffect } from 'react';
import ModalEditSubTask from './ModalEditSubTask';
import EditTask from './EditTask';

export default function Accordian({ data, title, toggleShowAddSubTask, onLoading, isLoading, categories }) {
    const [d, setD] = useState(data);
    const [singleRow, setSingleRow] = useState(null)
    const [row, setRow] = useState(title);
    const [expanded, setExpanded] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [showEditSubTask, setShowEditSubTask] = useState(false);
    const [selectedTaskId,setSelectedTaskId]= useState(null)
    const toggleShowEditSubTask = (s, startDate, endDate,taskId) => {
        setShowEditSubTask(!showEditSubTask);
        setSubTask(s)
        setStartDate(startDate);
        setEndDate(endDate)
        console.log("selected taskId",taskId);
        setSelectedTaskId(taskId)
    }
    const [showEditTask, setShowEditTask] = useState(false);
    const toggleShowEditTask = () => {
        setShowEditTask(!showEditTask);
    }
    const handleChangeState = () => {
        onLoading(!isLoading)
    }
    const [subTask, setSubTask] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    useEffect(() => {
        setRow(title);
    }, [title])

    const onClick = async (index) => {
        const temp = data.slice()
        console.log("temp", temp[index]);
        temp[index].isFinish = !temp[index].isFinish
        setSingleRow(temp[index])
        setD(temp)
        let washingtonRef = doc(db, "task", temp[index].parentTaskId);
        if (temp[index].isFinish) {
            let docs = await getDoc(washingtonRef);
            let subTask = docs.data().subTask;
            console.log(subTask);
            for (var i = 0; i < subTask.length; i++) {
                if (subTask[i].taskId === temp[index].taskId) {
                    subTask[i].isFinish = true;
                }
            }
            await updateDoc(washingtonRef, {
                subTask: subTask
            }).then(async () => {
                let docs = await getDoc(washingtonRef);
                if (docs.data().subTask.every(item => item.isFinish === true) == true) {
                    await updateDoc(washingtonRef, {
                        isFinish: true
                    });
                    setIsFinish(true);
                } else {
                    await updateDoc(washingtonRef, {
                        isFinish: false
                    });
                    setIsFinish(false);
                }
                let doc = await getDoc(washingtonRef);
                setRow(doc.data())
            })
        } else {
            let docs = await getDoc(washingtonRef);
            let subTask = docs.data().subTask;
            console.log(subTask);
            for (var i = 0; i < subTask.length; i++) {
                if (subTask[i].taskId === temp[index].taskId) {
                    subTask[i].isFinish = false;
                }
            }
            await updateDoc(washingtonRef, {
                subTask: subTask,
                isFinish: false
            });
            setIsFinish(false)
            let doc = await getDoc(washingtonRef);
            setRow(doc.data())
        }
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded)
    }
    const longPress = async (row) => {
        console.log("long press", row);
        toggleShowEditTask()
    }
    const editSubTask = async (startDate, endDate, parentTaskId, taskId, description) => {
        console.log(parentTaskId, selectedTaskId, description);
        const washingtonRef = doc(db, "task", parentTaskId);
        let docs = await getDoc(washingtonRef);
        let subTask = docs.data()?.subTask;
        for (var i = 0; i < subTask.length; i++) {
            if (subTask[i].taskId == selectedTaskId) {
                subTask[i].startDate = startDate;
                subTask[i].endDate = endDate;
                subTask[i].description = description;
            }
        }
        console.log(subTask);
        if (subTask != undefined) {
            await updateDoc(washingtonRef, {
                subTask: subTask
            });
            toggleShowEditSubTask();
            Alert.alert("Update successfully")
            handleChangeState();
        }
    }
    const editTask = async (startDate, endDate, task, selectedItems, date, taskId) => {
        console.log(startDate, endDate, task, selectedItems, date, taskId);
        const washingtonRef = doc(db, "task", taskId);
        await updateDoc(washingtonRef, {
            category: selectedItems,
            description: task,
            startDate: startDate,
            endDate: endDate,
            notificationTime: date
        });
        toggleShowEditTask();
        Alert.alert("Update successfully");
        handleChangeState();
    }
    const deleteTask = async (taskId) => {
        console.log(taskId);
        await deleteDoc(doc(db, "task", taskId));
        toggleShowEditTask();
        Alert.alert("Delete successfully");
        handleChangeState();
    }
    const deleteSubTask = async (parentTaskId, taskId) => {
        console.log(parentTaskId, taskId);
        const washingtonRef = doc(db, "task", parentTaskId);
        let docs = await getDoc(washingtonRef);
        let subTask = docs.data()?.subTask;
        for (var i = 0; i < subTask.length; i++) {
            if (subTask[i].taskId === taskId) {
                subTask.splice(i,1);
            }
        }
        await updateDoc(washingtonRef, {
            subTask: subTask
        });
        toggleShowEditSubTask();
        Alert.alert("Delete successfully")
        handleChangeState();
    }
    return (
        <View>
            <TouchableOpacity style={styles.row} onLongPress={() => longPress(row)} onPress={() => toggleExpand()}>
                <Text style={row.isFinish ? [styles.title, { textDecorationLine: 'line-through' }] : [styles.title]}>{row.description}</Text>
                <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={Colors.DARKGRAY} />
                <EditTask
                    startD={row.startDate.toDate()} endD={row.endDate.toDate()}
                    taskId={row.id} editTask={editTask}
                    notificationTime={row.notificationTime.toDate()}
                    taskDescription={row.description} selectedCategory={row.category}
                    categories={categories} show={showEditTask}
                    toggleShowEditTask={toggleShowEditTask} deleteTask={deleteTask}
                />
            </TouchableOpacity>
            <View style={styles.parentHr} />
            {
                expanded &&
                <View style={{}}>
                    <FlatList
                        data={row.subTask}
                        numColumns={1}
                        scrollEnabled={false}
                        renderItem={({ item, index }) =>
                            <View>
                                <TouchableOpacity onLongPress={() => {
                                    console.log("hello",item);
                                    toggleShowEditSubTask(item.description, item.startDate.seconds, item.endDate.seconds,item.taskId)
                                }} style={[styles.childRow, styles.button, item.isFinish ? styles.btnActive : styles.btnInActive]} onPress={() => onClick(index)}>
                                    <Text style={item.isFinish ? [styles.font, styles.itemInActive, { textDecorationLine: 'line-through' }] : [styles.font, styles.itemInActive]} >{item.description}</Text>
                                    <Icon name={'check-circle'} size={24} color={item.isFinish ? Colors.GREEN : Colors.LIGHTGRAY} />
                                </TouchableOpacity>
                                <View style={styles.childHr} />
                                <ModalEditSubTask object={item} deleteSubTask={deleteSubTask} editSubTask={editSubTask} taskId={item.taskId} startD={item.startDate?.toDate()} endD={item.endDate?.toDate()} subtask={subTask} show={showEditSubTask} toggleShow={toggleShowEditSubTask} parentTaskId={item.parentTaskId} /> 
                            </View>
                        } />
                    <TouchableOpacity style={[styles.childRow, styles.button]} onPress={() => toggleShowAddSubTask(title)}>
                        <Text style={[styles.font, styles.itemInActive]} >Add new sub task</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '100%',
        height: 54,
        alignItems: 'center',
        paddingLeft: 35,
        paddingRight: 35,
        fontSize: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.DARKGRAY,
    },
    itemActive: {
        fontSize: 12,
        color: Colors.GREEN,
    },
    itemInActive: {
        fontSize: 12,
        color: Colors.DARKGRAY,
    },
    btnActive: {
        borderColor: Colors.GREEN,
    },
    btnInActive: {
        borderColor: Colors.DARKGRAY,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        backgroundColor: Colors.CGRAY,
    },
    childRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.GRAY,
    },
    parentHr: {
        height: 1,
        color: Colors.WHITE,
        width: '100%'
    },
    childHr: {
        height: 1,
        backgroundColor: Colors.LIGHTGRAY,
        width: '100%',
    },
    colorActive: {
        borderColor: Colors.GREEN,
    },
    colorInActive: {
        borderColor: Colors.DARKGRAY,
    }

});