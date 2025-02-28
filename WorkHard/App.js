import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Alert,
  Text, View, TouchableOpacity, 
  TouchableHighlight, TouchableWithoutFeedback, 
  Pressable, TextInput, ScrollView } from 'react-native';
import { theme } from './colors';
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY="@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  useEffect(() => {
    loadToDos();
  }, []);
  const addToDo = async () => {
    if (text === ""){
      return;
    }
    const newToDos = {
      ...toDos, 
      [Date.now()]: {text, working},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async(key) => {
    Alert.alert(
      "Delete To Do", "Are you sure?", [
      {text: "Cancel"},
      {text: "I'm Sure", 
      onPress: () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      },
    },
    ]);
    return; 
  };
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (playload) => setText(playload);
  console.log(toDos);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.grey: "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        value={text}
        onChangeText={onChangeText}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
        style={styles.input}/>
      <ScrollView>
        {Object.keys(toDos).map((key) => (
        toDos[key].working === working ? (<View style={styles.toDo} key={key}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <Text>🌸</Text>
          </TouchableOpacity>
        </View>) : null
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight:"600",
  },
  input : {
    backgroundColor: "white",
    paddingVertical:15,
    paddingHorizontal: 20,
    borderRadius:30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo:{
    backgroundColor:theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    boaderRadius: 15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  toDoText:{
    color:"white",
    fontSize: 16,
    fontWeight: "500",
  }
});
