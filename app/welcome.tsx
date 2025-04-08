import supabase from "../lib/supabase";
import { signOut } from "../lib/supabase_auth"
import { addTask, getTasks, getUser } from "../lib/supabase_crud";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Modal } from "react-native"
import Task from "../components/Task";
import CreateTaskModal from "../components/CreateTaskModal";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";

const Welcome = () => {
  const [userId, setUserId] = useState(null);
  const [signedIn, setSignedIn] = useState('');
  const router = useRouter();
  const [taskItems, setTaskItems] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const priorityLevels = ['low', 'medium', 'high'];

  useEffect(() => {
    const getUserData = async () => {
      const { data: {user} } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id); //sets current session user id to UUID
        loadUser(user.id);
      }
    };

    getUserData();
  }, []);

  //get first & last name of user
  const loadUser = async (id) => {
    const user = await getUser(id);
    setSignedIn(user);
  }

  //load tasks whenever userid changes
  useEffect(() => {
    if(userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks(userId);
      setTaskItems(tasks);
      console.log(tasks);
    } catch (error) {
      console.log('Error', 'failed to load tasks');
    }
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    try {
      //add task to database
      await addTask(userId, taskTitle, deadline, priority);

      //get new list of tasks
      await fetchTasks();

      //reset state variables
      setTaskTitle('');
      setDeadline(new Date());
      setPriority('low');  
    } catch (error) {
      alert(error);
    }
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };
  
  const renderTaskItems = () => {
    if (taskItems.length === 0) {
      return <Text style={styles.noTasksText}>No tasks found</Text>;
    }
  
    return taskItems.map((item, index) => (
      <View key={`${item.title}-${index}`} style={[
        styles.taskItem,
        item.priority === 'high' && styles.highPriority,
        item.priority === 'medium' && styles.mediumPriority,
        item.priority === 'low' && styles.lowPriority,
      ]}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskDeadline}>
            📅 {new Date(item.deadline).toLocaleDateString()}
          </Text>
          {item.priority && (
            <Text style={styles.taskPriority}>
              ⚡ {item.priority.toUpperCase()}
            </Text>
          )}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, {signedIn?.first_name || 'User'}!</Text>
      <View >
          {/* Today's Tasks */}
          <View style={styles.tasksWrapper}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
              <ScrollView style={styles.items}>
                {renderTaskItems()}
              </ScrollView>
          </View>
      </View>
      {/* write a task*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
        >
        <TextInput style={styles.input} value={taskTitle} placeholder={"Write a Task"} onChangeText={text => setTaskTitle(text)}/>
        {/* <Text>Select a date</Text>
        <DateTimePicker
          value={deadline}
          mode="date"
          display= "default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDeadline(selectedDate);
            }
          }}
        /> */}
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
    justifyContent: 'center',
    alignItems: 'center',
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
  taskItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  highPriority: {
    borderLeftColor: '#ff3b30',
  },
  mediumPriority: {
    borderLeftColor: '#ff9500',
  },
  lowPriority: {
    borderLeftColor: '#34c759',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskDeadline: {
    color: '#666',
    fontSize: 14,
  },
  taskPriority: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
})

export default Welcome;