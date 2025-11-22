import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useThemeColors } from '../utils/ColorTheme';

type BottomNavLayoutProps = {
  children: React.ReactNode;
};

const BottomNavLayout = ({ children }: BottomNavLayoutProps) => {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      > */}
        {children}
      {/* </ScrollView> */}

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomNavLayout;
