import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

// Helper to get current day in Bangkok timezone (0=Sunday, 6=Saturday)
function getBangkokDay() {
  const now = new Date();
  // Bangkok is UTC+7
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bangkok = new Date(utc + 7 * 60 * 60000);
  return bangkok.getDay();
}

const API_URL = 'https://school-schedule-api-five.vercel.app/api/today';

export default function TodayScreen() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWeekend, setIsWeekend] = useState(false);
  const [weekendMessage, setWeekendMessage] = useState<string | null>(null);

  useEffect(() => {
    const day = getBangkokDay();
    if (day === 0 || day === 6) {
      setIsWeekend(true);
      setWeekendMessage('วันนี้เป็นวันหยุด (Saturday/Sunday)');
      setLoading(false);
      Alert.alert('แจ้งเตือน', 'วันนี้เป็นวันหยุด (Saturday/Sunday)');
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const data = await response.json();
        setSchedules(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
        Alert.alert('Error', 'ไม่สามารถเอาข้ำมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isWeekend) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{weekendMessage}</Text>
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
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Today's Schedules</Text>
      {schedules.length === 0 ? (
        <Text>No schedules for today.</Text>
      ) : (
        schedules.map((item, idx) => (
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
            {/* <Text>ครู: {item.teather}</Text> */}
          </View>
        ))
      )}
    </ScrollView>
  );
}