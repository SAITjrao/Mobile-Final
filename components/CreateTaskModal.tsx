import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

const CreateTaskModal = ({ visible, onClose, onCreateTask}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('');
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const priorityOptions = ['Low', 'Medium', 'High'];

  return (
    <Provider>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create New Task</Text>

            {/* Task Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            {/* Deadline Picker */}
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                Deadline: {deadline.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

            {/* Priority Selector */}
            <Menu
              visible={priorityMenuVisible}
              onDismiss={() => setPriorityMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  style={styles.priorityButton}
                  onPress={() => setPriorityMenuVisible(true)}
                >
                  <Text style={styles.priorityButtonText}>
                    Priority: {priority}
                  </Text>
                </TouchableOpacity>
              }
            >
              {priorityOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setPriority(option);
                    setPriorityMenuVisible(false);
                  }}
                  title={option}
                />
              ))}
            </Menu>

            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={handleCreateTask}
                style={styles.createButton}
              >
                Create Task
              </Button>
              <Button 
                mode="outlined" 
                onPress={onClose}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  datePickerButton: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  priorityButton: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  createButton: {
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
  },
});

export default CreateTaskModal;