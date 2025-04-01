import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard } from "react-native"
import { signOut } from "../lib/supabase_auth"
import { useLocalSearchParams, useRouter } from "expo-router";
import Task from "../components/Task";
import { useState } from "react";

export default function Welcome() {
  const { userEmail } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask(null);
  }
  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, {userEmail}!</Text>
      <Pressable onPress={handleSignOut} style={styles.pressable}>
        <Text style={styles.button}>Sign Out</Text>
      </Pressable>
      <View >
          {/* Today's Tasks */}
          <View style={styles.tasksWrapper}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
              <View style={styles.items}>
                {
                  taskItems.map((item, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                        <Task text={item} />
                      </TouchableOpacity>
                    )})
                }
              </View>
          </View>
      </View>
      {/* write a task*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
        >
        <TextInput style={styles.input} value={task} placeholder={"Write a Task"} onChangeText={text => setTask(text)}/>
        <TouchableOpacity onPress={() => handleAddTask()}> 
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },  
  pressable: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10, 
  },
  button: {
      padding: 10,
      backgroundColor: "green",
      color: "white",
      width: 100,
      textAlign: "center",
      margin: 10,
      borderRadius: 5,
  },
  tasksWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
  },
  sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',    
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    backgroundColor: 'yellow',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'orange',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: 'orange',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'orange',
  },
  addText: {
    
  },
})