import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import BottomNav from "../components/BottomNav";

type BottomNavLayoutProps = {
  children: React.ReactNode;
};

const BottomNavLayout = ({ children }: BottomNavLayoutProps) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

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
