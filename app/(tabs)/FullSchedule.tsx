import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';

// Tab icon for Expo Router or React Navigation
export const tabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Image
    source={require('@/assets/images/table.png')}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

const API_URL = 'https://school-schedule-api-five.vercel.app/api';

const DAYS = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
];

export default function FullSchedule() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch full schedule');
        }
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
        Alert.alert('Error', 'ไม่สามารถเอาข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const schedules: any[] = data[selectedDay] || [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Full Schedule</Text>
      <Picker
        selectedValue={selectedDay}
        onValueChange={(itemValue) => setSelectedDay(itemValue)}
        style={{ marginBottom: 16 }}
      >
        {DAYS.map((day) => (
          <Picker.Item key={day.value} label={day.label} value={day.value} />
        ))}
      </Picker>
      {schedules.length === 0 ? (
        <Text>No schedules for this day.</Text>
      ) : (
        schedules.map((item: any, idx: number) => (
          <View
            key={idx}
            style={{
              marginBottom: 12,
              padding: 12,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              คาบ {item.period}: {item['subject-name']} ({item['subject-code']})
            </Text>
            <Text>เวลา: {item.start} - {item.end}</Text>
            <Text>ห้อง: {item.room}</Text>
            {/* <Text>ครู: {item.teacher}</Text> */}
          </View>
        ))
      )}
    </ScrollView>
  );
}