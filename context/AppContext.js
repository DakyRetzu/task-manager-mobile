import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Track auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '';

  const loadData = useCallback(async () => {
    if (!session) return;
    const { data: projectRows } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    const { data: taskRows } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    setProjects(projectRows || []);
    setTasks(taskRows || []);
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time subscriptions
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        setProjects((prev) => {
          if (payload.eventType === 'INSERT') {
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map((p) => (p.id === payload.new.id ? payload.new : p));
          }
          if (payload.eventType === 'DELETE') {
            return prev.filter((p) => p.id !== payload.old.id);
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        setTasks((prev) => {
          if (payload.eventType === 'INSERT') {
            if (prev.some((t) => t.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map((t) => (t.id === payload.new.id ? payload.new : t));
          }
          if (payload.eventType === 'DELETE') {
            return prev.filter((t) => t.id !== payload.old.id);
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email, password, fullName) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProjects([]);
    setTasks([]);
  }

  async function addProject(name) {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, owner_id: session.user.id })
      .select()
      .single();
    if (error) throw error;
    setProjects((prev) => [data, ...prev]);
    return data;
  }

  async function deleteProject(projectId) {
    await supabase.from('projects').delete().eq('id', projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.project_id !== projectId));
  }

  async function addTask(projectId, title) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ project_id: projectId, title, status: 'todo', assignee: userName.slice(0, 2).toUpperCase() || 'ME' })
      .select()
      .single();
    if (error) throw error;
    setTasks((prev) => [data, ...prev]);
    return data;
  }

  async function deleteTask(taskId) {
    await supabase.from('tasks').delete().eq('id', taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  async function updateTaskStatus(taskId, status) {
    await supabase.from('tasks').update({ status }).eq('id', taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }

  function tasksForProject(projectId) {
    return tasks.filter((t) => t.project_id === projectId);
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
        session, authLoading, userName,
        projects, tasks,
        signIn, signUp, signOut,
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