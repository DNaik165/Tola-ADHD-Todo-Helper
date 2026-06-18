// // // // screens/AddTaskScreen.js real

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../context/TaskContext';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SPACING } from '../utils/theme';

const AddTaskScreen = ({ navigation }) => {
  const { addTask } = useContext(TaskContext);
  const [taskName, setTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskPriority, setTaskPriority] = useState(2);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleAddTask = () => {
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      taskName,
      taskDetails,
      myStatus: taskStatus,
      date: taskDate.toISOString().split('T')[0],
      priority: taskPriority,
      attachments,
    };
    addTask(newTask);
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachments([...attachments, { uri: result.assets[0].uri }]);
    }
    setShowAttachmentModal(false);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachments([...attachments, { uri: result.assets[0].uri }]);
    }
    setShowAttachmentModal(false);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachments([...attachments, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
    setShowAttachmentModal(false);
  };

  const handleRemoveAttachment = (uri) => {
    setAttachments(attachments.filter(att => att.uri !== uri));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Task</Text>
          <Text style={styles.headerSubtitle}>Break it down into small steps!</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>What needs to be done?</Text>
          <TextInput
            placeholder="Task Name"
            value={taskName}
            onChangeText={setTaskName}
            style={styles.input}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Any specific details?</Text>
          <TextInput
            placeholder="Task Details"
            value={taskDetails}
            onChangeText={setTaskDetails}
            style={styles.textArea}
            multiline
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: SPACING.s }]}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={taskPriority}
                onValueChange={(itemValue) => setTaskPriority(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="High" value={1} color={COLORS.danger} />
                <Picker.Item label="Medium" value={2} color={COLORS.warning} />
                <Picker.Item label="Low" value={3} color={COLORS.success} />
              </Picker>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: SPACING.s }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={taskStatus}
                onValueChange={(itemValue) => setTaskStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="In Progress" value="Progress" />
                <Picker.Item label="Done" value="Done" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>When is it due?</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.primary} />
            <Text style={styles.dateSelectorText}>
              {taskDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setTaskDate(selectedDate);
            }}
          />
        )}

        <View style={styles.formGroup}>
          <View style={styles.attachmentHeader}>
            <Text style={styles.label}>Attachments</Text>
            <TouchableOpacity 
              style={styles.addAttachmentBtn}
              onPress={() => setShowAttachmentModal(true)}
            >
              <FontAwesome5 name="paperclip" size={14} color={COLORS.primary} />
              <Text style={styles.addAttachmentText}>Add</Text>
            </TouchableOpacity>
          </View>

          {attachments.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsList}>
              {attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Image source={{ uri: attachment.uri }} style={styles.attachmentImg} />
                  <TouchableOpacity 
                    onPress={() => handleRemoveAttachment(attachment.uri)}
                    style={styles.removeBtn}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noAttachmentsText}>No attachments added yet</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddTask}>
          <Text style={styles.submitButtonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showAttachmentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Source</Text>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
                <View style={[styles.iconCircle, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="camera" size={24} color={COLORS.white} />
                </View>
                <Text style={styles.modalOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={handlePickImage}>
                <View style={[styles.iconCircle, { backgroundColor: COLORS.success }]}>
                  <Ionicons name="image" size={24} color={COLORS.white} />
                </View>
                <Text style={styles.modalOptionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={handlePickFile}>
                <View style={[styles.iconCircle, { backgroundColor: COLORS.warning }]}>
                  <MaterialIcons name="attach-file" size={24} color={COLORS.white} />
                </View>
                <Text style={styles.modalOptionText}>File</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalCloseBtn} 
              onPress={() => setShowAttachmentModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bubbles,
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: SPACING.l,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    fontSize: 16,
    fontFamily: FONTS.regular,
    ...SHADOWS.light,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    fontSize: 16,
    fontFamily: FONTS.regular,
    minHeight: 100,
    textAlignVertical: 'top',
    ...SHADOWS.light,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 12,
    ...SHADOWS.light,
  },
  dateSelectorText: {
    marginLeft: SPACING.s,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  addAttachmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: 20,
    ...SHADOWS.light,
  },
  addAttachmentText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  attachmentsList: {
    flexDirection: 'row',
    marginTop: SPACING.s,
  },
  attachmentItem: {
    marginRight: SPACING.m,
    position: 'relative',
  },
  attachmentImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  noAttachmentsText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: SPACING.l,
    ...SHADOWS.medium,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bubbles,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bubbles,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  modalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  modalOption: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  modalOptionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    marginTop: SPACING.s,
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});

export default AddTaskScreen;
