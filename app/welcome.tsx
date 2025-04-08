import supabase from "../lib/supabase";
import { signOut } from "../lib/supabase_auth"
import { addTask, getTasks, getUser } from "../lib/supabase_crud";
import { useRouter } from "expo-router";
import { useEffect, useState, } from "react";
import { Alert, ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Modal } from "react-native"
import CreateTaskModal from "../components/CreateTaskModal";
import Icon from 'react-native-vector-icons/FontAwesome';

const Welcome = () => {
  const [userId, setUserId] = useState(null);
  const [signedIn, setSignedIn] = useState('');
  const router = useRouter();
  const [taskItems, setTaskItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //grab user data
  useEffect(() => {
    const getUserData = async () => {
      const { data: {user} } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); //sets current session user id to UUID
        await loadUser(user.id);
      }
    };

    getUserData();
  }, []);

  //load user details
  const loadUser = async (id) => {
    const user = await getUser(id);
    setSignedIn(user[0]);
  }

  //load tasks when userId changes
  useEffect(() => {
    if(userId) {
      fetchTasks();
    }
  }, [userId, fetchTasks]);

  //function to load tasks from database
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks(userId);
      setTaskItems(tasks);
    } catch (error) {
      console.log('Error', 'failed to load tasks');
    }
  };

  //create new task and refresh task list
  const handleCreateTask = async (taskData) => {
    try {
      await addTask(userId, taskData.title, taskData.deadline, taskData.priority);
      await fetchTasks();
      setModalVisible(false);
    } catch (error) {
      alert(error.message);
    }
  };

  //signs out the user
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
      console.log(error);
    }
  };
  
  //renders list of tasks
  const renderTaskItems = () => {
    if (taskItems.length === 0) {
      return <Text style={styles.noTasksText}>No tasks found</Text>;
    }
    
    //date formatting options
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
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
            📅 {new Date(item.deadline).toLocaleDateString(undefined, dateOptions)}
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

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {signedIn.first_name + signedIn.last_name}!</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.welcome}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View >
          {/* Today's Tasks */}
          <View style={styles.tasksWrapper}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
              <ScrollView contentContainerStyle={styles.items}>
                {renderTaskItems()} 
              </ScrollView>
          </View>
      </View>

      {/* write a task*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
        >
        <TouchableOpacity onPress={() => setModalVisible(true)}> 
          <View style={[styles.addWrapper, { backgroundColor: '#34c759' }]}>
            <Icon name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateTask={handleCreateTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 20,
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
  welcome: {
    fontSize: 14,
  },
  tasksWrapper: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 80,
  },
  sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',    
  },
  items: {
    marginTop: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
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
  addText: {
    fontSize: 24,
    fontWeight: 'semi-bold',
  },
})

export default Welcome;