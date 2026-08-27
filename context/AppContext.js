import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

const initialProjects = [
  { id: 'PRJ-014', name: 'Client Portal Revamp' },
  { id: 'PRJ-011', name: 'Mobile Onboarding v2' },
  { id: 'PRJ-009', name: 'Internal Design System' },
];

const initialTasks = [
  { id: 'TSK-041', projectId: 'PRJ-014', title: 'Define empty-state copy for dashboard', status: 'todo', due: 'SEP 3', assignee: 'JR', priority: 'Normal', description: 'Write copy for the dashboard when a user has no projects yet.' },
  { id: 'TSK-042', projectId: 'PRJ-014', title: 'Audit color contrast on light theme', status: 'todo', due: 'SEP 5', assignee: 'DT', priority: 'Normal', description: 'Check every screen against WCAG AA in light mode.' },
  { id: 'TSK-037', projectId: 'PRJ-014', title: 'Build settings → billing screen', status: 'progress', due: 'SEP 1', assignee: 'MK', priority: 'High', description: 'Plan summary, invoice history, payment method management.' },
  { id: 'TSK-029', projectId: 'PRJ-014', title: 'Set up real-time sync layer', status: 'done', due: 'AUG 27', assignee: 'DT', priority: 'Normal', description: 'Wire up live updates across connected clients.' },
];

let taskCounter = initialTasks.length;
let projectCounter = initialProjects.length;

export function AppProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [userName, setUserName] = useState('');

  function addProject(name) {
    projectCounter += 1;
    const newProject = { id: `PRJ-${String(projectCounter).padStart(3, '0')}`, name };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }

  function deleteProject(projectId) {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  }

  function addTask(projectId, title) {
    taskCounter += 1;
    const newTask = {
      id: `TSK-${String(taskCounter).padStart(3, '0')}`,
      projectId,
      title,
      status: 'todo',
      due: '—',
      assignee: 'DT',
      priority: 'Normal',
      description: '',
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function updateTaskStatus(taskId, status) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }

  function tasksForProject(projectId) {
    return tasks.filter((t) => t.projectId === projectId);
  }

  function projectProgress(projectId) {
    const list = tasksForProject(projectId);
    if (list.length === 0) return 0;
    const done = list.filter((t) => t.status === 'done').length;
    return done / list.length;
  }

  return (
    <AppContext.Provider
      value={{
        projects, tasks, userName, setUserName,
        addProject, deleteProject, addTask, deleteTask,
        updateTaskStatus, tasksForProject, projectProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}