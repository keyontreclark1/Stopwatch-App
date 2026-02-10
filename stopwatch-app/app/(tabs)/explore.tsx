import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E53935', dark: '#C62828' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FFFFFF"
          name="timer"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          About
        </ThemedText>
      </ThemedView>
      <ThemedText>
        A simple and accurate stopwatch application built with React Native and Expo.
        Perfect for timing events, tracking laps, and measuring time intervals with precision.
      </ThemedText>
      <Collapsible title="Core Features">
        <ThemedText>
          The stopwatch offers precise time measurement using{' '}
          <ThemedText type="defaultSemiBold">requestAnimationFrame</ThemedText> for accurate
          timing. Track time down to milliseconds with hours, minutes, seconds, and milliseconds
          display.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Lap Tracking">
        <ThemedText>
          Record and track multiple lap times while the stopwatch is running. View your lap history
          with individual lap numbers and cumulative times. Perfect for racing, workouts, or any
          activity where lap times matter.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Controls">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Start:</ThemedText> Begin the timer{' '}
          <ThemedText type="defaultSemiBold">Stop:</ThemedText> Pause the timer{' '}
          <ThemedText type="defaultSemiBold">Reset:</ThemedText> Clear all time and laps{' '}
          <ThemedText type="defaultSemiBold">Lap:</ThemedText> Record a new lap time
        </ThemedText>
      </Collapsible>
      <Collapsible title="Platform Support">
        <ThemedText>
          This stopwatch app is built with React Native and Expo, supporting both{' '}
          <ThemedText type="defaultSemiBold">iOS</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">Android</ThemedText> platforms. Enjoy a native
          experience on both mobile operating systems.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              Running on iOS - optimized for Apple devices with native performance.
            </ThemedText>
          ),
          android: (
            <ThemedText>
              Running on Android - Material Design compatible with smooth animations.
            </ThemedText>
          ),
        })}
      </Collapsible>
      <Collapsible title="Technical Details">
        <ThemedText>
          Built using modern React patterns including hooks (
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>useStopwatch</ThemedText>
          ), state management, and refs for precise timing control.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
