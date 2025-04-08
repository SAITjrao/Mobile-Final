import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const CreateTaskModal = ({ visible, onClose, onCreateTask}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (!priority) {
        alert('Please select a priority');
        return;
    }

    onCreateTask({
        title: taskTitle,
        deadline: deadline,
        priority: priority.toLowerCase()
    });

    // Reset form
    setTaskTitle('');
    setDeadline(new Date());
    setPriority('medium');
  };
  
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const PriorityButton = ({ label, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        isSelected && styles[`${value}PrioritySelected`]
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.priorityButtonText,
        isSelected && styles[`${value}PriorityText`]
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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

            <View style={styles.priorityContainer}>
              <PriorityButton
                label="Low"
                value="low"
                isSelected={priority === 'low'}
                onPress={() => setPriority('low')}
              />
              <PriorityButton
                label="Medium"
                value="medium"
                isSelected={priority === 'medium'}
                onPress={() => setPriority('medium')}
              />
              <PriorityButton
                label="High"
                value="high"
                isSelected={priority === 'high'}
                onPress={() => setPriority('high')}
              />
            </View>

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
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  lowPrioritySelected: {
    backgroundColor: '#e6f7e6',
    borderColor: '#34c759',
  },
  mediumPrioritySelected: {
    backgroundColor: '#fff7e6',
    borderColor: '#ff9500',
  },
  highPrioritySelected: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff3b30',
  },
  lowPriorityText: {
    color: '#34c759',
    fontWeight: 'bold',
  },
  mediumPriorityText: {
    color: '#ff9500',
    fontWeight: 'bold',
  },
  highPriorityText: {
    color: '#ff3b30',
    fontWeight: 'bold',
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: Platform.OS === 'ios' ? '#f5f5f5' : 'white',
  },
});

export default CreateTaskModal;