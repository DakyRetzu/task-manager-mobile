import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

const FILTERS = ['All', 'Mine', 'Due soon'];

function MomentumRing({ percent }) {
  const r = 27;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent);
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={r} stroke={colors.border} strokeWidth={3} fill="none" />
      <Circle
        cx={32} cy={32} r={r}
        stroke={colors.platinum}
        strokeWidth={3}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
      />
    </Svg>
  );
}

export default function ProjectsScreen({ navigation }) {
  const { projects, tasks, userName, addProject, deleteProject, projectProgress } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const doneCount = tasks.filter((t) => t.status === 'done').length;

  function handleCreate() {
    const trimmed = newName.trim();
    if (trimmed.length === 0) return;
    addProject(trimmed);
    setNewName('');
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>{userName || 'there'}</Text>
          </View>
          <View style={styles.bell}>
            <Text style={{ color: colors.textDim }}>🔔</Text>
            <View style={styles.badge} />
          </View>
        </View>

        <View style={styles.momentumCard}>
          <MomentumRing percent={tasks.length ? doneCount / tasks.length : 0} />
          <View style={{ marginLeft: 18, flex: 1 }}>
            <Text style={styles.momentumEyebrow}>THIS WEEK'S MOMENTUM</Text>
            <Text style={styles.momentumLine}>{doneCount} task{doneCount === 1 ? '' : 's'} closed so far.</Text>
            <Text style={styles.momentumSub}>{tasks.length - doneCount} still open.</Text>
          </View>
        </View>

        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>ACTIVE PROJECTS</Text>
          <Text style={styles.sectionLabel}>{projects.length.toString().padStart(2, '0')}</Text>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {projects.map((p) => {
            const projectTasks = tasks.filter((t) => t.projectId === p.id);
            const progress = projectProgress(p.id);
            return (
              <TouchableOpacity key={p.id} style={styles.card} onPress={() => navigation.navigate('Board', { project: p })}>
                <View style={[styles.cardTop, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                  <View>
                    <Text style={styles.cardName}>{p.name}</Text>
                    <Text style={styles.cardMeta}>{projectTasks.length} tasks</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Delete project?', `"${p.name}" and its tasks will be removed.`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteProject(p.id) },
                      ])
                    }
                    style={{ padding: 4 }}
                  >
                    <Text style={{ color: colors.textFaint, fontSize: 15 }}>×</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cardFoot}>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${progress * 100}%` }]} />
                  </View>
                  <Text style={styles.progressNum}>{Math.round(progress * 100)}%</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {projects.length === 0 && (
            <Text style={{ color: colors.textFaint, fontSize: 13, textAlign: 'center', marginTop: 30 }}>
              No projects yet. Tap + to create one.
            </Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: colors.bg, fontSize: 22, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New project</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Project name"
              placeholderTextColor={colors.textFaint}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setModalVisible(false); setNewName(''); }}>
                <Text style={{ color: colors.textDim, fontSize: 13 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreate} onPress={handleCreate}>
                <Text style={{ color: colors.bg, fontSize: 13, fontWeight: '600' }}>Create</Text>
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 22, paddingTop: 60, paddingBottom: 4,
  },
  greeting: { fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 14, color: colors.textFaint, marginBottom: 4 },
  title: { fontFamily: fonts.serif, fontSize: 29, color: colors.text },
  bell: {
    width: 36, height: 36, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  badge: {
    position: 'absolute', top: 6, right: 6, width: 5, height: 5,
    borderRadius: 3, backgroundColor: colors.racing,
  },
  momentumCard: {
    margin: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    padding: 20, flexDirection: 'row', alignItems: 'center',
  },
  momentumEyebrow: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.platinum, letterSpacing: 1.5, marginBottom: 6 },
  momentumLine: { fontFamily: fonts.serif, fontSize: 15, color: colors.text, lineHeight: 21 },
  momentumSub: { fontSize: 11.5, color: colors.textFaint, marginTop: 5 },
  sectionLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 6, paddingBottom: 10,
  },
  sectionLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, letterSpacing: 1.5 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 22, paddingBottom: 16 },
  filterChip: { borderWidth: 1, borderColor: colors.border, paddingVertical: 7, paddingHorizontal: 13 },
  filterChipActive: { borderColor: colors.platinumLine, backgroundColor: colors.platinumSoft },
  filterText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  filterTextActive: { color: colors.platinum },
  list: { paddingHorizontal: 22, gap: 11 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSoft, padding: 18 },
  cardTop: { marginBottom: 14 },
  cardName: { fontFamily: fonts.serif, fontSize: 16.5, color: colors.text },
  cardMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, marginTop: 5 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  track: { flex: 1, height: 1.5, backgroundColor: colors.border, marginRight: 16 },
  fill: { height: '100%', backgroundColor: colors.platinum },
  progressNum: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  fab: {
    position: 'absolute', bottom: 30, right: 24, width: 52, height: 52,
    backgroundColor: colors.platinum, alignItems: 'center', justifyContent: 'center',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(3,4,6,0.65)', justifyContent: 'center', padding: 30 },
  modalCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 22 },
  modalTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.text, marginBottom: 16 },
  modalInput: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, fontSize: 14.5, color: colors.text },
  modalCancel: { flex: 1, borderWidth: 1, borderColor: colors.border, paddingVertical: 13, alignItems: 'center' },
  modalCreate: { flex: 1, backgroundColor: colors.platinum, paddingVertical: 13, alignItems: 'center' },
});