import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import IndexScreen from './(tabs)/index';
import AboutScreen from './(tabs)/about';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#16213e',
            },
          }}
        >
          <Stack.Screen 
            name="Stopwatch" 
            component={IndexScreen}
            options={{
              title: '⏱️ Stopwatch',
            }}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen}
            options={{
              title: '📱 About',
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
  },
});

