import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';

type BottomNavLayoutProps = {
  children: React.ReactNode;
};

const BottomNavLayout = ({ children }: BottomNavLayoutProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

export default BottomNavLayout;
