//screens/TaskListScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { TaskContext } from '../context/TaskContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SPACING } from '../utils/theme';

const TaskListScreen = ({ navigation }) => {
  const { tasks } = useContext(TaskContext);

  // Convert tasks to agenda items format
  const items = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push({
      name: task.taskName,
      time: task.date,
      details: task.taskDetails,
      priority: task.priority,
      status: task.myStatus,
      taskData: task,
    });
    return acc;
  }, {});

  const renderEmptyData = () => {
    return (
      <View style={styles.emptyDataContainer}>
        <FontAwesome5 name="calendar-day" size={50} color={COLORS.textSecondary} style={{ marginBottom: SPACING.m }} />
        <Text style={styles.emptyDataText}>No Tasks for this day</Text>
        <Text style={styles.emptyDataSubText}>Enjoy your free time!</Text>
      </View>
    );
  };

  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };

  const renderItem = (item) => {
    let priorityColor;
    switch (item.priority) {
      case 1: priorityColor = COLORS.danger; break;
      case 2: priorityColor = COLORS.warning; break;
      case 3: priorityColor = COLORS.success; break;
      default: priorityColor = COLORS.primary;
    }

    let statusColor;
    switch (item.status) {
      case 'Pending': statusColor = COLORS.warning; break;
      case 'Progress': statusColor = COLORS.primary; break;
      case 'Done': statusColor = COLORS.success; break;
      default: statusColor = COLORS.secondary;
    }

    return (
      <TouchableOpacity 
        onPress={() => handleTaskPress(item.taskData)}
        activeOpacity={0.8}
        style={[styles.taskCard, { borderLeftColor: priorityColor }]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.taskTitle} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.taskDetails} numberOfLines={2}>{item.details}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.timeContainer}>
            <FontAwesome5 name="clock" size={12} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        theme={{
          agendaDayTextColor: COLORS.primary,
          agendaDayNumColor: COLORS.primary,
          agendaTodayColor: COLORS.accent,
          agendaKnobColor: COLORS.primary,
          selectedDayBackgroundColor: COLORS.primary,
          dotColor: COLORS.accent,
          todayTextColor: COLORS.accent,
        }}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.9}
      >
        <FontAwesome5 name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyDataText: {
    fontSize: 20,
    fontFamily: FONTS.bubbles,
    color: COLORS.textPrimary,
  },
  emptyDataSubText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    marginRight: SPACING.m,
    marginTop: 17,
    borderLeftWidth: 5,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: FONTS.bubbles,
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: SPACING.s,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.white,
  },
  taskDetails: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default TaskListScreen;
