import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SPACING } from '../utils/theme';

const TaskItem = ({ task, onPress }) => {
  let priorityColor;
  switch (task.priority) {
    case 1: priorityColor = COLORS.danger; break;
    case 2: priorityColor = COLORS.warning; break;
    case 3: priorityColor = COLORS.success; break;
    default: priorityColor = COLORS.primary;
  }

  return (
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.8}>
      <View style={[styles.taskCard, { borderLeftColor: priorityColor }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.taskName} numberOfLines={1}>{task.taskName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
            <Text style={styles.statusText}>Done</Text>
          </View>
        </View>
        
        <Text style={styles.taskDetails} numberOfLines={2}>{task.taskDetails}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-check" size={12} color={COLORS.textSecondary} />
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

const categorizeCompletedTasks = (tasks) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const getDateStr = (date) => date.toISOString().split('T')[0];
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysAgoStr = getDateStr(sevenDaysAgo);

  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);
  const fourteenDaysAgoStr = getDateStr(fourteenDaysAgo);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAgoStr = getDateStr(thirtyDaysAgo);

  const categorizedTasks = {
    today: [],
    sevenDaysAgo: [],
    fourteenDaysAgo: [],
    thirtyDaysAgo: [],
    older: []
  };

  tasks.forEach(task => {
    if (task.myStatus === 'Done') {
      const taskDate = new Date(task.date);
      const taskDateStr = getDateStr(taskDate);

      if (taskDateStr === todayStr) {
        categorizedTasks.today.push(task);
      } else if (taskDateStr >= sevenDaysAgoStr && taskDateStr < todayStr) {
        categorizedTasks.sevenDaysAgo.push(task);
      } else if (taskDateStr >= fourteenDaysAgoStr && taskDateStr < sevenDaysAgoStr) {
        categorizedTasks.fourteenDaysAgo.push(task);
      } else if (taskDateStr >= thirtyDaysAgoStr && taskDateStr < fourteenDaysAgoStr) {
        categorizedTasks.thirtyDaysAgo.push(task);
      } else if (taskDateStr < thirtyDaysAgoStr) {
        categorizedTasks.older.push(task);
      }
    }
  });

  return categorizedTasks;
};

const CompletedTasksScreen = () => {
  const navigation = useNavigation();
  const { tasks } = useContext(TaskContext);
  const [categorizedTasks, setCategorizedTasks] = useState({
    today: [],
    sevenDaysAgo: [],
    fourteenDaysAgo: [],
    thirtyDaysAgo: [],
    older: []
  });

  useEffect(() => {
    const tasksByCategory = categorizeCompletedTasks(tasks);
    setCategorizedTasks(tasksByCategory);
  }, [tasks]);

  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };

  const sections = [
    { title: "Today's", data: categorizedTasks.today },
    { title: 'Last 7 Days', data: categorizedTasks.sevenDaysAgo },
    { title: 'Last 14 Days', data: categorizedTasks.fourteenDaysAgo },
    { title: 'Last 30 Days', data: categorizedTasks.thirtyDaysAgo },
    { title: 'Older', data: categorizedTasks.older }
  ].filter(section => section.data.length > 0);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="check-circle" size={50} color={COLORS.textSecondary} style={{ marginBottom: SPACING.m }} />
      <Text style={styles.emptyText}>No completed tasks yet</Text>
      <Text style={styles.emptySubText}>Keep going, you can do it!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => <TaskItem task={item} onPress={handleTaskPress} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
  },
  sectionHeaderContainer: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.s,
    marginTop: SPACING.m,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: FONTS.bubbles,
    color: COLORS.primary,
  },
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    marginVertical: SPACING.s,
    borderLeftWidth: 5,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  taskName: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: FONTS.bubbles,
    color: COLORS.textPrimary,
  },
  emptySubText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
});

export default CompletedTasksScreen;




