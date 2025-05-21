import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';

const PhotoViewer = () => {
  const imageUrl = 'https://placekitten.com/786/531'; // เปลี่ยนเป็นลิงก์ของคุณได้
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 40; // padding ซ้าย-ขวารวมกัน

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>แสดงรูปแบบ Responsive</Text>
      <Image
        source={require('@/assets/images/img1.png')} //{{ uri: imageUrl }}
        style={{
          width: screenWidth - horizontalPadding,
          aspectRatio: 786 / 531,
          borderRadius: 12,
          backgroundColor: '#ddd',
          transform: [{ scale: 0.5 }]
        }}
        resizeMode="contain"
        onError={() => alert('โหลดรูปไม่สำเร็จ')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
});

export default PhotoViewer;
