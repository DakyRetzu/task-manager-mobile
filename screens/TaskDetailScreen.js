import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

const STATUSES = [
  { key: 'todo', label: 'To do' },
  { key: 'progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
];

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, updateTaskStatus, deleteTask } = useApp();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: colors.text, padding: 24 }}>Task not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
        <Text style={{ color: colors.textDim, fontSize: 13 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.id}>{task.id}</Text>
      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.sectionLabel}>Status</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s.key}
            onPress={() => updateTaskStatus(task.id, s.key)}
            style={[styles.statusChip, task.status === s.key && styles.statusChipActive]}
          >
            <Text style={[styles.statusText, task.status === s.key && styles.statusTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Assignee</Text>
        <Text style={styles.rowVal}>{task.assignee}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Due date</Text>
        <Text style={[styles.rowVal, { color: colors.platinum }]}>{task.due}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Priority</Text>
        <Text style={[styles.rowVal, task.priority === 'High' && { color: '#D08993' }]}>{task.priority}</Text>
      </View>

      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.desc}>{task.description || 'No description yet.'}</Text>

      <TouchableOpacity
        style={{ marginTop: 30, borderWidth: 1, borderColor: colors.racing, paddingVertical: 13, alignItems: 'center' }}
        onPress={() =>
          Alert.alert('Delete task?', `"${task.title}" will be removed.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => { deleteTask(task.id); navigation.goBack(); } },
          ])
        }
      >
        <Text style={{ color: colors.racing, fontSize: 13, fontWeight: '600' }}>Delete task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  id: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.platinum, marginBottom: 10 },
  title: { fontFamily: fonts.serif, fontSize: 22, color: colors.text, marginBottom: 22, lineHeight: 30 },
  sectionLabel: { fontFamily: fonts.serifItalic, fontSize: 13.5, color: colors.textFaint, marginTop: 22, marginBottom: 11 },
  statusChip: { borderWidth: 1, borderColor: colors.border, paddingVertical: 8, paddingHorizontal: 12 },
  statusChipActive: { borderColor: colors.platinumLine, backgroundColor: colors.platinumSoft },
  statusText: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  statusTextActive: { color: colors.platinum },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderTopWidth: 1, borderTopColor: colors.borderSoft },
  rowLabel: { fontSize: 13, color: colors.textDim },
  rowVal: { fontSize: 13, color: colors.text, fontWeight: '500' },
  desc: { fontSize: 14, lineHeight: 22, color: colors.textDim },
});