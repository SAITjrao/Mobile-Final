import supabase from "../lib/supabase";
import { signOut } from "../lib/supabase_auth"
import { addTask, deleteTask, getTasks, getUser, updateTask } from "../lib/supabase_crud";
import { useRouter } from "expo-router";
import { useEffect, useState, } from "react";
import { Alert, ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import CreateTaskModal from "../components/CreateTaskModal";
import TaskModal from "../components/TaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Icon from 'react-native-vector-icons/FontAwesome';

const Welcome = () => {
  const [userId, setUserId] = useState(null);
  const [signedIn, setSignedIn] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    deadline: new Date(),
    priority: 'low'
  });
  const router = useRouter();

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

  //function to load tasks from database
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks(userId);
      setTaskItems(tasks);
    } catch (error) {
      console.log('Error', 'failed to load tasks');
    }
  };

  //load tasks when userId changes
  useEffect(() => {
    if(userId) {
      fetchTasks();
    }
  }, [userId]);

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
  
  // load task in modal when clicked on
  const handleTaskPress = (task) => {
    console.log('Selected Task', task);
    setSelectedTask(task);
    console.log('Selected task is:', selectedTask);
    setEditForm({
      title: task.title,
      deadline: new Date(task.deadline), // Ensure the deadline is in Date format
      priority: task.priority
    });
    setEditModalVisible(true);
  }

  //update task in database and refresh
  const handleUpdateTask = async () => {
    try {
      await updateTask(selectedTask.id, editForm);
      await fetchTasks();
      handleCloseEditModal();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
      console.log(error);
    }
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  //delete tasks from database
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete);
      await fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setTaskToDelete(null);
    }
  }

  // close modal and reset selectedTask
  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedTask(null);
  }

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
    
    //map all tasks and display
    return taskItems.map((item, index) => (
      <View key={`${item.title}-${index}`} style={[
        styles.taskItemContainer,
        item.priority === 'high' && styles.highPriority,
        item.priority === 'medium' && styles.mediumPriority,
        item.priority === 'low' && styles.lowPriority,
      ]}>
        <TouchableOpacity 
          style={styles.checkboxContainer}  
          onPress={() => handleDeleteClick(item.id)}
        >
          <Icon name="remove" size={16} color="black" /> 
        </TouchableOpacity>
        <TouchableOpacity
          key={item.id}
          style={styles.taskContent}
          onPress={() => {
            handleTaskPress(item);
          }}
        >
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
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {signedIn.first_name} {signedIn.last_name}!</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.link}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View >
          {/* Today's Tasks */}
          <View style={styles.tasksWrapper}>
              <Text style={styles.sectionTitle}>UPCOMING</Text>
              <ScrollView contentContainerStyle={styles.items}>
                {renderTaskItems()} 
              </ScrollView>
          </View>
      </View>

      {/* Add new task*/}
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

      {/* Add Task Modal */}
      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateTask={handleCreateTask}
      />
      <TaskModal 
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateTask}
        mode="edit"
        task={selectedTask}
        editForm={editForm}
        setEditForm={setEditForm}
      />
      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        message="Are you sure you want to delete this task?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    padding: 10,
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
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
  link: {
    color: '#1723dd',
    fontSize: 14,
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
    fontWeight: 'semibold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#666',
  },
})

export default Welcome;