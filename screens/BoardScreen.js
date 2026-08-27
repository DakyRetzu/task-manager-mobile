import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

const COLUMNS = [
  { key: 'todo', title: 'To do', dotColor: colors.textFaint },
  { key: 'progress', title: 'In progress', dotColor: colors.platinum },
  { key: 'done', title: 'Done', dotColor: colors.steel },
];

export default function BoardScreen({ route, navigation }) {
  const project = route?.params?.project;
  const { tasksForProject, addTask, deleteTask } = useApp();
  const [tab, setTab] = useState('Board');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const tasks = project ? tasksForProject(project.id) : [];

  function handleCreate() {
    const trimmed = newTitle.trim();
    if (trimmed.length === 0 || !project) return;
    addTask(project.id, trimmed);
    setNewTitle('');
    setModalVisible(false);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Text style={{ color: colors.textDim, fontSize: 13 }}>← Projects</Text>
        </TouchableOpacity>
        <Text style={styles.greeting}>{project?.name ?? 'Project'}</Text>
        <Text style={styles.title}>Board</Text>
      </View>

      <View style={styles.tabs}>
        {['Board', 'Timeline', 'Files'].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
            <Text style={[styles.tab, tab === t && styles.tabActive]}>{t}</Text>
            {tab === t && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {tab !== 'Board' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textFaint, fontSize: 13 }}>{tab} — coming soon</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colScroll}>
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <View key={col.key} style={styles.kcol}>
                <View style={styles.kcolHead}>
                  <Text style={styles.kcolTitle}>{col.title}</Text>
                  <Text style={styles.kcolCount}>{colTasks.length.toString().padStart(2, '0')}</Text>
                </View>
                <View style={{ gap: 10 }}>
                  {colTasks.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.kcard, t.status === 'done' && { opacity: 0.55 }]}
                      onPress={() => navigation.navigate('TaskDetail', { taskId: t.id })}
                    >
                      <View style={[styles.kcardStatus, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                          <View style={[styles.statusDot, { backgroundColor: col.dotColor }]} />
                          <Text style={styles.kcardId}>{t.id}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert('Delete task?', `"${t.title}" will be removed.`, [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Delete', style: 'destructive', onPress: () => deleteTask(t.id) },
                            ])
                          }
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Text style={{ color: colors.textFaint, fontSize: 14 }}>×</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.kcardTitle}>{t.title}</Text>
                      <View style={styles.kcardFoot}>
                        <Text style={[styles.kcardDate, t.priority === 'High' && { color: colors.platinum }]}>{t.due}</Text>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{t.assignee}</Text></View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {colTasks.length === 0 && (
                    <Text style={{ color: colors.textFaint, fontSize: 11.5, paddingVertical: 6 }}>Nothing here yet.</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: colors.bg, fontSize: 22, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New task</Text>
            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Task title"
              placeholderTextColor={colors.textFaint}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setModalVisible(false); setNewTitle(''); }}>
                <Text style={{ color: colors.textDim, fontSize: 13 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreate} onPress={handleCreate}>
                <Text style={{ color: colors.bg, fontSize: 13, fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 26, paddingTop: 60, paddingBottom: 2 },
  greeting: { fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 14, color: colors.textFaint, marginBottom: 4 },
  title: { fontFamily: fonts.serif, fontSize: 23, color: colors.text },
  tabs: { flexDirection: 'row', gap: 24, paddingHorizontal: 26, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, marginTop: 14 },
  tabBtn: { paddingBottom: 13 },
  tab: { fontSize: 12.5, color: colors.textFaint },
  tabActive: { color: colors.platinum },
  tabUnderline: { height: 1.5, backgroundColor: colors.platinum, marginTop: 13, position: 'absolute', bottom: 0, left: 0, right: 0 },
  colScroll: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 20, gap: 16 },
  kcol: { width: 238 },
  kcolHead: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 13, paddingLeft: 2 },
  kcolTitle: { fontFamily: fonts.serifItalic, fontSize: 14, color: colors.textDim },
  kcolCount: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginLeft: 'auto' },
  kcard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSoft, padding: 14 },
  kcardStatus: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  statusDot: { width: 6, height: 6 },
  kcardId: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  kcardTitle: { fontSize: 13.5, lineHeight: 19, color: colors.text, marginBottom: 13 },
  kcardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kcardDate: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  avatar: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.platinumLine, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 9, fontWeight: '600', color: colors.textDim },
  fab: {
    position: 'absolute', bottom: 26, right: 22, width: 52, height: 52,
    backgroundColor: colors.platinum, alignItems: 'center', justifyContent: 'center',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(3,4,6,0.65)', justifyContent: 'center', padding: 30 },
  modalCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 22 },
  modalTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.text, marginBottom: 16 },
  modalInput: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, fontSize: 14.5, color: colors.text },
  modalCancel: { flex: 1, borderWidth: 1, borderColor: colors.border, paddingVertical: 13, alignItems: 'center' },
  modalCreate: { flex: 1, backgroundColor: colors.platinum, paddingVertical: 13, alignItems: 'center' },
});