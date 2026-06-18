// // //screens/HomeScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Switch, Button, Modal } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import {FontAwesome5, FontAwesome6} from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SPACING } from '../utils/theme';

const TaskItem = ({ task, onPress }) => {
  let statusColor;
  let cardBgColor;
  let statusTextColor = COLORS.white;

  switch (task.myStatus) {
    case 'Pending':
      statusColor = COLORS.warning;
      cardBgColor = '#FFF9F0'; // Ultra-light yellow
      break;
    case 'Progress':
      statusColor = COLORS.primary;
      cardBgColor = '#F0F8FF'; // Ultra-light blue
      break;
    case 'Done':
      statusColor = COLORS.success;
      cardBgColor = '#F2FFF9'; // Ultra-light green
      statusTextColor = COLORS.textPrimary;
      break;
    default:
      statusColor = COLORS.secondary;
      cardBgColor = COLORS.white;
      break;
  }

  return (
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.8}>
      <View style={[styles.todayTaskCard, { backgroundColor: cardBgColor }]}>
        <Text style={styles.todayTaskName} numberOfLines={1}>{task.taskName}</Text>
        <View style={[styles.todayTaskTag, { backgroundColor: statusColor }]}>
          <Text style={[styles.todayTaskTagText, { color: statusTextColor }]}>{task.myStatus}</Text>
        </View>
        {task.attachments && task.attachments.length > 0 && (
          <Image
            source={{ uri: task.attachments[0].uri }}
            style={styles.todayAttachmentImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};


const CustomTaskItem = ({ task, onPress }) => {
  // Define colors for status
  let statusColor;
  let statusTextColor = COLORS.white;
  let cardBgColor;

  switch (task.myStatus) {
    case 'Pending':
      statusColor = COLORS.warning;
      cardBgColor = '#FFF9F0'; // Ultra-light yellow
      break;
    case 'Progress':
      statusColor = COLORS.primary;
      cardBgColor = '#F0F8FF'; // Ultra-light blue
      break;
    case 'Done':
      statusColor = COLORS.success;
      statusTextColor = COLORS.textPrimary;
      cardBgColor = '#F2FFF9'; // Ultra-light green
      break;
    default:
      statusColor = COLORS.secondary;
      cardBgColor = COLORS.white;
      break;
  }

  // Define colors for priority
  let priorityColor;
  switch (task.priority) {
    case 1: // High
      priorityColor = COLORS.danger;
      break;
    case 2: // Medium
      priorityColor = COLORS.warning;
      break;
    case 3: // Low
      priorityColor = COLORS.success;
      break;
    default:
      priorityColor = COLORS.primary;
      break;
  }

  return (
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.9}>
      <View style={[styles.mainTaskCard, { borderLeftColor: priorityColor, backgroundColor: cardBgColor }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{task.taskName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={[styles.statusBadgeText, { color: statusTextColor }]}>{task.myStatus}</Text>
          </View>
        </View>
        
        <Text style={styles.cardDetails} numberOfLines={2}>{task.taskDetails}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={12} color={COLORS.textSecondary} />
            <Text style={styles.dateText}>{task.date}</Text>
          </View>
          {task.attachments && task.attachments.length > 0 && (
            <FontAwesome5 name="paperclip" size={12} color={COLORS.primary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};





const HomeScreen = ({ navigation }) => {
  const { tasks, filterTasks, filterTasksByDate , sortTasksByPriority, completedTasksCount, isGameUnlocked} = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [activeTab, setActiveTab] = useState('All');
  const [todayTasks, setTodayTasks] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayTasks(filterTasksByDate(today));
    console.log('Today\'s Tasks:', todayTasks);
  }, [tasks, filterTasksByDate]);


  useEffect(() => {
    let tasksToDisplay = [];
    if (activeTab === 'Today' || focusMode) {
      const today = new Date().toISOString().split('T')[0];
      tasksToDisplay = filterTasksByDate(today);
    } else {
      tasksToDisplay = filterTasks(activeTab);
    }
    console.log('Tasks before sorting:', tasksToDisplay);
    const sortedTasks = sortTasksByPriority(tasksToDisplay);
    console.log('Tasks after sorting:', sortedTasks);
    setFilteredTasks(sortedTasks);
  }, [tasks, activeTab, filterTasks, filterTasksByDate, focusMode]);
  
 
 


  const filterTasksByStatus = (status) => {
    setActiveTab(status);
  };



  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };

  

  return (
    <View style={styles.homeContainer}>
       {/* Focus Mode Toggle */}
       <View style={styles.focusModeToggle}>
        <Text style={styles.focusModeText}>Focus Mode</Text>
        <Switch
          value={focusMode}
          onValueChange={(value) => setFocusMode(value)}
        />
      </View>

 

      <ScrollView>
        <View style={styles.upComings}>
          <Text style={styles.upcomingText}>Today's Tasks</Text>
          <FlatList
            data={todayTasks}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TaskItem task={item} onPress={handleTaskPress} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          </View>
          {!focusMode && (
          <>

          <Text style={styles.upcomingText}>My Task List</Text>
          <View style={styles.filterContainer}>
            {['All', 'Pending', 'Progress', 'Done'].map(status => (
              <TouchableOpacity
                key={status}
                onPress={() => filterTasksByStatus(status)}
                style={[styles.filterButton, activeTab === status && styles.activeFilterButton]}
              >
                <Text style={[styles.filterText, activeTab === status && styles.activeFilterText]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {filteredTasks.map((item) => (
            <CustomTaskItem key={item.id} task={item} onPress={handleTaskPress} />
          ))}
        </>
        )}

      </ScrollView>


      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsModalVisible(true)}
      >
        <FontAwesome5 name="gamepad" size={28} color={COLORS.white} />
      </TouchableOpacity>

<Modal
  visible={isModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
        <FontAwesome6 name="xmark" size={24} color={COLORS.white} />
      </TouchableOpacity>
      
      <FontAwesome5 name="lock" size={50} color={COLORS.accent} style={{marginBottom: 20}} />
      
      <Text style={styles.modalText}>Unlock the Fun!</Text>
      <Text style={styles.modalSubText}>Complete 3 tasks to play</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {completedTasksCount}/3
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((completedTasksCount/3)*100, 100)}%` }]} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.gameButton, !isGameUnlocked && { opacity: 0.6 }]}
        onPress={() => {
          if (isGameUnlocked) {
            setIsModalVisible(false);
            navigation.navigate('Game');
          } else {
            alert('Complete ' + (3 - completedTasksCount) + ' more tasks to unlock!');
          }
        }}
      >
        <Text style={styles.gameButtonText}>
          {isGameUnlocked ? "Let's Play!" : "Locked"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
  },
  upComings: {
    marginBottom: SPACING.l,
  },
  upcomingText: {
    fontSize: 22,
    fontFamily: FONTS.bubbles,
    marginBottom: SPACING.s,
    color: COLORS.primary,
  },
  focusModeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 16,
    ...SHADOWS.light,
  },
  focusModeText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
  },
  todayTaskCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: SPACING.m,
    width: 160,
    height: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  todayTaskName: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  todayTaskTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  todayTaskTagText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: FONTS.regular,
  },
  todayAttachmentImage: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  mainTaskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: FONTS.bubbles,
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: FONTS.regular,
  },
  cardDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.m,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
    paddingVertical: SPACING.s,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.m,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.accent,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  floatingButtonText: {
    color: COLORS.white,
    fontSize: 28,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    borderRadius: 30,
    margin: SPACING.l,
    ...SHADOWS.medium,
  },
  modalText: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: SPACING.m,
    fontFamily: FONTS.bubbles,
    textAlign: 'center',
  },
  gameButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 25,
    marginTop: SPACING.l,
    ...SHADOWS.light,
  },
  gameButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bubbles,
  },
  xText: {
    color: COLORS.white,
    fontSize: 40,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalSubText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.l,
    opacity: 0.9,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: FONTS.bubbles,
    marginBottom: SPACING.s,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 6,
  },
});

export default HomeScreen;

