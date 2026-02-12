import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⏱️ Stopwatch App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.description}>
            A fully-featured stopwatch application built with React Native and Expo.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Start/Pause/Stop timer controls</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Lap functionality with individual remove</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Lap time differences (+/-)</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Clear all laps option</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Millisecond precision timing</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <Text style={styles.description}>
            Built using:
          </Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>• React Native 0.73</Text>
            <Text style={styles.techItem}>• Expo SDK 50</Text>
            <Text style={styles.techItem}>• React Navigation 6</Text>
            <Text style={styles.techItem}>• TypeScript</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Tips</Text>
          <Text style={styles.description}>
            • Tap "Start" to begin the timer{'\n'}
            • Tap "Pause" to pause the timer{'\n'}
            • Tap "Stop" to reset to zero{'\n'}
            • Tap "Lap" while running to record lap times{'\n'}
            • Swipe or tap "✕" to remove individual laps{'\n'}
            • Use "Clear All" to remove all laps at once
          </Text>
        </View>

        <Text style={styles.footer}>
          Made with ❤️ using React Native & Expo
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  featureList: {
    marginTop: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    color: '#4ecca3',
    fontSize: 16,
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
  },
  techList: {
    marginTop: 10,
  },
  techItem: {
    fontSize: 15,
    color: '#e0e0e0',
    marginBottom: 5,
    paddingLeft: 10,
  },
  footer: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
});

