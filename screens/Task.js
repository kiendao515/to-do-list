import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Chip, FAB, IconButton, List, MD2Colors, MD3Colors, Menu, Modal, Portal } from 'react-native-paper'
import ModalAddCategory from '../components/ModalAddCategory';
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../config';
import ModalAddTask from '../components/ModalAddTask';
import CalendarPicker from 'react-native-calendar-picker';
import ModalAddSubTask from '../components/ModalAddSubTask';
import Accordian from '../components/Accordian';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function Task({ navigation }) {
  function renderAccordians(){
    const items = [];
    task.forEach((item) => {
      items.push(
          <Accordian
              categories={data}
              toggleShowEditTask ={toggleShowEditTask}
              onLoading={handleLoadingChange}
              isLoading ={isLoadingTask}
              parentTaskId={parentTaskId}
              toggleShowAddSubTask={toggleShowAddSubTask}
              title = {item}
              data = {item.subTask}
          />
      );
    })
    return items;
  }
  const [state, setState] = useState({ open: false });
  const [checked, setChecked] = useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const renderItem = ({ item }) => (<Chip style={styles.chip} onPress={() => console.log('Pressed' + item.id)}>{item.category}</Chip>)
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddSubTask, setShowAddSubTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [parentTaskId, setParentTaskId] = useState("");
  const toggleShow = () => setShow(p => !p);
  const toggleShowAddTask = () => setShowAddTask(p => !p)
  const toggleShowAddSubTask = (item) => {
    console.log(item);
    setShowAddSubTask(p => !p)
    setParentTaskId(item.id)
  };
  const toggleShowEditTask = (item) => {
    console.log(item);
    setShowEditTask(p => !p)
  };
  const hideShowAddSubTask = () => {
    setShowAddSubTask(false)
  }
  const handleLoadingChange = async (loading) => {
    setIsLoadingTask(loading);
  }
  const [expanded, setExpanded] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [task, setTask] = useState([]);
  const [subTask, setSubTask] = useState([]);
  const [isFinish,setIsFinish]= useState([])
  const handlePress = (item, index) => {
    console.log(item, index);
    setExpanded(!expanded);
  }
  let onDateChange = (date) => {
    console.log(date);
    setSelectedDate(date)
    getTask(new Date(date));
  }
  let getCategory = async () => {
    const q = query(collection(db, "category"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    let c = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      c.push(toDo);
    });

    setData(c);
    setIsLoading(false);
  };
  

  let getTask = async (date) => {
    console.log("get selected date", date);
    const q = query(collection(db, "task"),
      where("userId", "==", auth.currentUser.uid),
      where("startDate", "<=", date));
    const q2 = query(collection(db, "task"),
      where("userId", "==", auth.currentUser.uid),
      where("endDate", ">=", date));
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    let documents = querySnapshot.docs.concat(querySnapshot2.docs);
    let filteredDocuments =
      documents.filter((doc, index, self) =>
        self.findIndex(d => d.id === doc.id) !== index);
    let c = [];
    let st = [];
    let array_check=[]
    filteredDocuments.forEach((doc) => {
      console.log(doc.data().notificationTime.seconds - new Date().getTime() / 1000);
      schedulePushNotification(doc.data().notificationTime.seconds - new Date().getTime() / 1000,doc.data())
      let toDo = doc.data();
      toDo.id = doc.id;
      c.push(toDo);
      st.push(doc.data().subTask)
    });
    setTask(c);
    setSubTask(st);
    //setIsLoading(false);
  }
  if (isLoading) {
    getCategory();
    //getTask(new Date());
  }
  if(isLoadingTask){
    setIsLoadingTask(!isLoadingTask)
    getTask(new Date());
  }
  const addCategory = (content) => {
    if(content!=undefined){
      console.log(content);
      let category = {
        category: content,
        userId: auth.currentUser.uid
      };
      addDoc(collection(db, "category"), category).then(docRef => {
        if (docRef.id) {
          toggleShow();
          setIsLoading(true);
        }
      });
    }else{
      Alert.alert("Category can be not null")
    }
  }
  async function schedulePushNotification(x,data) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.description,
        body: "Your task is due soon",
        data: { data: 'goes here' },
      },
      trigger: { seconds: x},
    });
  }
  useEffect(() => {
    //schedulePushNotification()
    const unsubscribe = navigation.addListener('focus', () => {
      getCategory();
      getTask(new Date());
    });

    return unsubscribe;
  }, [navigation,task]);

  const addTask = (startDate, endDate, task, selectedItems,date) => {
    let t = {
      userId: auth.currentUser.uid,
      description: task,
      startDate: startDate,
      endDate: endDate,
      isFinish: false,
      category: selectedItems,
      notificationTime:date,
      subTask: []
    }
    addDoc(collection(db, "task"), t).then(doc => {
      if (doc.id) {
        toggleShowAddTask();
        setIsLoading(true);
        getTask(new Date());
      }
    })
  }
  const addSubTask = async (startDate, endDate, parentTaskId, content) => {
    const washingtonRef = doc(db, "task", parentTaskId);
    await updateDoc(washingtonRef, {
      subTask: arrayUnion({
        taskId:Date.now(),
        userId: auth.currentUser.uid,
        description: content,
        startDate: startDate,
        endDate: endDate,
        isFinish: false,
        parentTaskId: parentTaskId
      })
    });
    hideShowAddSubTask();
    setIsLoading(false);
    getTask(new Date());
  }
  return (
    <View>
      <View style={styles.rowContainer}>
        {isLoading ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> :  <FlatList
          data={data}
          renderItem={renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />}
      </View>
      <View style={{ width: '100%', top: 50 }}>
        <CalendarPicker
          onDateChange={onDateChange}
        />
      </View>
      {data.length!=0 ? <View
        style={{
          position: "absolute",
          top: 60,
          right: 0,
          flexDirection: 'row'
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton style={{ top: -10 }} size={27} icon="dots-vertical" onPress={openMenu}></IconButton>}>
          <Menu.Item onPress={() => {
            closeMenu(), navigation.navigate("ManageCategory", {
              category: data
            })
          }} title="Manage category" />
          {/* <Menu.Item onPress={() => { }} title="Searching" /> */}
        </Menu>
      </View>:null}
      <Portal >
        <FAB.Group
          style={{
            position: "absolute",
            bottom: 40,
          }}
          open={open}
          visible
          icon={open ? 'calendar-today' : 'plus'}
          actions={[
            {
              icon: 'format-list-checkbox',
              label: 'Create new Task',
              onPress: toggleShowAddTask,
            },
            {
              icon: 'playlist-edit',
              label: 'Create new Category',
              onPress: toggleShow,
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
      <View style={styles.row}>
        <View>
          { renderAccordians()}
        </View>
      </View>
      <ModalAddSubTask show={showAddSubTask} toggleShow={toggleShowAddSubTask} parentTaskId={parentTaskId} addSubTask={addSubTask} />
      <ModalAddCategory title="Create new category" show={show} toggleShow={toggleShow} addCategory={addCategory} />
      <ModalAddTask categories={data} show={showAddTask} toggleShow={toggleShowAddTask} addTask={addTask} />
    </View>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    top: 50,
    padding: 10,
    width: "90%"
  },
  chip: {
    marginRight: 10
  },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  row: {
    top: 50
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
})