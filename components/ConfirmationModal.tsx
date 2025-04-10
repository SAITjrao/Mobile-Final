import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              onPress={onClose} 
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onConfirm} 
              style={[styles.button, styles.confirmButton]}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  messageText: {
    marginBottom: 20,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 14,
  fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
  },
});

export default ConfirmationModal;