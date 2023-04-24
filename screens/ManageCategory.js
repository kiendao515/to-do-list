import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, MD2Colors } from 'react-native-paper'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import ModalAddCategory from '../components/ModalAddCategory';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../config';
import ModalActionConfirm from '../components/ModalActionConfirm';
const ManageCategory = ({ route, navigation }) => {
    const [show, setShow] = useState(false);
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const toggleShow = () => setShow(p => !p);
    const toggleShowDelete=()=> setShowDeletePopup(p=>!p);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState({
        cate: "", id: ""
    });
    const [isLoading, setIsLoading] = useState(true);
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

    if (isLoading) {
        getCategory();
    }
    const editCategory = (item) => {
        console.log('edit item', item);
        setCategory({
            cate: item.category,
            id: item.id
        })
        toggleShow();
    }
    const deleteCategory =(item)=>{
        console.log("delete",item);
        setCategory({
            cate: item.category,
            id: item.id
        })
        toggleShowDelete()
    }
    const confirmDelete= async()=>{
        await deleteDoc(doc(db, "category", category.id));
        toggleShowDelete();
        setIsLoading(true)
    }
    const saveEditCategory = async (text) => {
        console.log('save edit category', category.id, text);
        const q = query(collection(db, "category"), where("userId", "==", auth.currentUser.uid));
        const washingtonRef = doc(db, "category", category.id);
        console.log(washingtonRef.id);
        await updateDoc(washingtonRef, {
            category: text
        });
        toggleShow();
        setIsLoading(true);
    }
    const renderItem = ({ item }) => (
        <Item item={item} show={show} toggleShow={toggleShow}
            editCategory={editCategory} deleteCategory={deleteCategory}
        />
    );

    const Item = ({ item, editCategory, show, toggleShow ,deleteCategory}) => (
        <View style={styles.listTile}>
            <Entypo style={styles.leading} name="dot-single" size={24} color="#139bf0" />
            <Text style={styles.title}>{item.category}</Text>
            <View style={styles.trailing}>
                <Entypo name="edit" size={20} color="black" onPress={() => {
                    editCategory(item)
                }} />
                <MaterialIcons name="delete-outline" size={20} color="black" onPress={()=>{
                    deleteCategory(item)
                }} />
            </View>
        </View>
    );
    return (
        <View>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.navigate("Task") }} />
                <Appbar.Content title="Manage category" />
                <Appbar.Action icon="calendar" onPress={() => { }} />
            </Appbar.Header>
            <View>{isLoading ? <ActivityIndicator animating={true} color={MD2Colors.red800} />
                : <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            }
            </View>
            <ModalAddCategory title="Edit your category" show={show} toggleShow={toggleShow} addCategory={(c) => saveEditCategory(c)} cate={category.cate} />
            <ModalActionConfirm show={showDeletePopup} toggleShow={toggleShowDelete} deleteCategory={(c)=> confirmDelete(c)}/>
        </View>
    )
}

export default ManageCategory

const styles = StyleSheet.create({
    listTile: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#666666"
    },
    leading: {
        width: "10%"
    },
    title: {
        width: "70%",
        fontSize: 18
    },
    trailing: {
        width: "10%",
        flexDirection: "row"
    }
})