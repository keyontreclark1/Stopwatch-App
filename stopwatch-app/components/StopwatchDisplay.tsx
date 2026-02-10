import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useStopwatch } from '@/hooks/useStopwatch';
import * as Haptics from 'expo-haptics';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LapTime {
  id: number;
  time: number;
  lapNumber: number;
}

interface LapTimeItemProps {
  lap: LapTime;
  index: number;
  previousLapTime: number | null;
  allLaps: LapTime[];
}

function LapTimeItem({
  lap,
  index,
  previousLapTime,
  allLaps,
}: LapTimeItemProps) {
  const formatLapTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getLapDifference = () => {
    if (previousLapTime === null) return null;
    const diff = lap.time - previousLapTime;
    const isNegative = diff < 0;
    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / 60000);
    const seconds = Math.floor((absDiff % 60000) / 1000);
    const milliseconds = Math.floor((absDiff % 1000) / 10);

    return `${isNegative ? '-' : '+'}${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const lapDiff = previousLapTime !== null ? lap.time - previousLapTime : null;

  return (
    <ThemedView style={[styles.lapItem, index % 2 === 0 && styles.lapItemEven]}>
      <View style={styles.lapInfo}>
        <ThemedText style={styles.lapNumber}>Lap {lap.lapNumber}</ThemedText>
        <ThemedText style={styles.lapTime}>{formatLapTime(lap.time)}</ThemedText>
      </View>
      {lapDiff !== null && (
        <ThemedText
          style={[
            styles.lapDiff,
            lapDiff < 0 ? styles.lapDiffNegative : styles.lapDiffPositive,
          ]}>
          {getLapDifference()}
        </ThemedText>
      )}
    </ThemedView>
  );
}

export default function StopwatchDisplay() {
  const {
    elapsedTime,
    isRunning,
    laps,
    start,
    stop,
    reset,
    lap,
    formattedTime,
  } = useStopwatch();

  const scrollRef = useRef<ScrollView>(null);

  const triggerHaptic = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleStartStop = () => {
    triggerHaptic();
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  const handleReset = () => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    reset();
  };

  const handleLap = () => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    lap();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Time Display */}
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          {formattedTime.hours !== '00' && (
            <View style={styles.timeBlock}>
              <ThemedText style={styles.timeText}>
                {formattedTime.hours}
              </ThemedText>
              <ThemedText style={styles.timeLabel}>HR</ThemedText>
            </View>
          )}
          <View style={styles.timeBlock}>
            <ThemedText style={styles.timeText}>
              {formattedTime.hours !== '00' ? formattedTime.minutes : formattedTime.minutes}
            </ThemedText>
            <ThemedText style={styles.timeLabel}>MIN</ThemedText>
          </View>
          <View style={styles.timeBlock}>
            <ThemedText style={styles.timeText}>
              {formattedTime.seconds}
            </ThemedText>
            <ThemedText style={styles.timeLabel}>SEC</ThemedText>
          </View>
          <View style={styles.timeBlock}>
            <ThemedText style={styles.millisecondsText}>
              .{formattedTime.milliseconds}
            </ThemedText>
            <ThemedText style={styles.timeLabel}>MS</ThemedText>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, styles.resetButtonText]}>RESET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
          onPress={handleStartStop}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, isRunning ? styles.stopButtonText : styles.startButtonText]}>
            {isRunning ? 'STOP' : 'START'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.lapButton]}
          onPress={handleLap}
          activeOpacity={0.7}
          disabled={!isRunning && elapsedTime === 0}>
          <Text style={[styles.buttonText, styles.lapButtonText]}>LAP</Text>
        </TouchableOpacity>
      </View>

      {/* Laps List */}
      <View style={styles.lapsContainer}>
        <ScrollView
          ref={scrollRef}
          style={styles.lapsScrollView}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}>
          {laps.length === 0 ? (
            <View style={styles.noLapsContainer}>
              <ThemedText style={styles.noLapsText}>
                Tap LAP to record lap times
              </ThemedText>
            </View>
          ) : (
            laps.map((lapItem, index) => (
              <LapTimeItem
                key={lapItem.id}
                lap={lapItem}
                index={index}
                previousLapTime={
                  index < laps.length - 1 ? laps[index + 1].time : null
                }
                allLaps={laps}
              />
            ))
          )}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  timeContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  timeBlock: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: -2,
  },
  millisecondsText: {
    fontSize: 40,
    fontWeight: '200',
    letterSpacing: -1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.6,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 15,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    minWidth: 110,
  },
  stopButton: {
    backgroundColor: '#f44336',
    minWidth: 110,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  lapButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  startButtonText: {
    color: '#fff',
  },
  stopButtonText: {
    color: '#fff',
  },
  resetButtonText: {
    color: '#FF5722',
  },
  lapButtonText: {
    color: '#fff',
  },
  lapsContainer: {
    flex: 1.5,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  lapsScrollView: {
    flex: 1,
  },
  noLapsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLapsText: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  lapItemEven: {
    backgroundColor: 'rgba(100, 100, 100, 0.05)',
  },
  lapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lapNumber: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
    width: 60,
  },
  lapTime: {
    fontSize: 18,
    fontWeight: '400',
    fontVariant: ['tabular-nums'],
  },
  lapDiff: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  lapDiffNegative: {
    color: '#4CAF50',
  },
  lapDiffPositive: {
    color: '#f44336',
  },
});

