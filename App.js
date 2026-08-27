import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Fraunces_400Regular, Fraunces_500Medium, Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import BoardScreen from './screens/BoardScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import { colors } from './theme';
import { AppProvider } from './context/AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_400Regular_Italic,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.platinum} />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Projects" component={ProjectsScreen} />
          <Stack.Screen name="Board" component={BoardScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} presentation="modal" />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}