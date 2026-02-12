import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

type Lap = {
  id: number;
  time: number;
  formattedTime: string;
};

export default function IndexScreen({ navigation }: { navigation: any }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [displayTime, setDisplayTime] = useState('00:00.000');

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);
        setDisplayTime(formatTime(elapsed));
      }, 10);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setDisplayTime('00:00.000');
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning && time > 0) {
      const newLap: Lap = {
        id: laps.length + 1,
        time: time,
        formattedTime: formatTime(time),
      };
      setLaps([newLap, ...laps]);
    }
  };

  const clearLaps = () => {
    setLaps([]);
  };

  const removeLap = (id: number) => {
    setLaps(laps.filter(lap => lap.id !== id));
  };

  const getLapDifference = (currentLap: Lap, previousLap?: Lap): string => {
    if (!previousLap) return '';
    const diff = currentLap.time - previousLap.time;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${formatTime(Math.abs(diff))}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{displayTime}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopTimer}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isRunning ? styles.pauseButton : styles.startButton]}
          onPress={isRunning ? pauseTimer : startTimer}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.lapButton]}
          onPress={addLap}
          disabled={!isRunning && time === 0}
        >
          <Text style={styles.buttonText}>Lap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lapsContainer}>
        <View style={styles.lapsHeader}>
          <Text style={styles.lapsTitle}>Laps ({laps.length})</Text>
          {laps.length > 0 && (
            <TouchableOpacity onPress={clearLaps}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {laps.map((lap, index) => {
            const prevLap = laps[index + 1];
            const diff = getLapDifference(lap, prevLap);
            return (
              <View key={lap.id} style={styles.lapItem}>
                <Text style={styles.lapText}>Lap {laps.length - index}</Text>
                <View style={styles.lapTimeContainer}>
                  <Text style={styles.lapTime}>{lap.formattedTime}</Text>
                  {diff && (
                    <Text style={styles.lapDiff}>{diff}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeLap(lap.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.aboutButtonText}>ℹ️ About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  timerText: {
    fontSize: 60,
    fontWeight: '200',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    minWidth: 100,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4ecca3',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  lapButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  lapsContainer: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  lapsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  lapsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  clearButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  lapText: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '500',
  },
  lapTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lapTime: {
    color: '#ffffff',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  lapDiff: {
    color: '#4ecca3',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutButton: {
    alignSelf: 'center',
    padding: 15,
    marginBottom: 20,
  },
  aboutButtonText: {
    color: '#a0a0a0',
    fontSize: 16,
  },
});

