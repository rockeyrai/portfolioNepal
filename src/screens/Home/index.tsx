import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';
import SubIndices from './components/SubIndices';
import MarketTab from './components/MarketTab';
import HomeNews from './components/HomeNews';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSearchHistory } from '../../utils/searchHistory';
import { ScrollView } from 'react-native';
import { useThemeColors } from '../../utils/ColorTheme';

const HomeScreen = () => {
  //  logAllStorage();j
  // clearSearchHistory()
  const { colors } = useThemeColors();

  return (
    <>
      <ProfileHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <SummaryDisplay />
        <MainNepseGraph />
        <MarketTab />
        <SubIndices />
        <HomeNews />
      </ScrollView>
    </>
  );
};

export default HomeScreen;



// import React, { useCallback, useMemo } from "react";
// import { View, Text, StyleSheet, FlatList } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // --------------------------------------------
// // FAKE TEST DATA (5000 items)
// // --------------------------------------------
// const generateTestData = () => {
//   return Array.from({ length: 5000 }).map((_, i) => ({
//     symbol: `SYM${i}`,
//     companyName: `Company Name ${i}`,
//     sectorName: `Sector ${i % 12}`,
//   }));
// };

// const TEST_DATA = generateTestData();

// // --------------------------------------------
// // ROW COMPONENT
// // --------------------------------------------
// const Row = React.memo(({ symbol, name, sector }) => {
//   return (
//     <View style={styles.row}>
//       <Text style={styles.symbol}>{symbol}</Text>

//       <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//         {name}
//       </Text>

//       <Text style={styles.sector}>{sector}</Text>
//     </View>
//   );
// });

// // --------------------------------------------
// // MAIN SCREEN
// // --------------------------------------------
// const HomeScreen = () => {
//   const companies = useMemo(() => TEST_DATA, []);

//   const renderItem = useCallback(
//     ({ item }) => (
//       <Row
//         symbol={item.symbol}
//         name={item.companyName}
//         sector={item.sectorName}
//       />
//     ),
//     []
//   );

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={{ flex: 1 }}>
//         <FlatList
//           data={companies}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.symbol}

//           // Smooth rendering settings
//           initialNumToRender={20}
//           maxToRenderPerBatch={30}
//           updateCellsBatchingPeriod={20}
//           windowSize={10}
//           removeClippedSubviews={true}

//           // Fixed layout = faster scroll
//           getItemLayout={(_, index) => ({
//             length: 60,
//             offset: 60 * index,
//             index,
//           })}
//         />
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   row: {
//     height: 60,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     justifyContent: "space-between",
//     backgroundColor: "white",
//   },
//   symbol: { fontWeight: "bold", fontSize: 16, width: 60 },
//   name: { fontSize: 14, opacity: 0.8, flex: 1, marginHorizontal: 6 },
//   sector: { fontSize: 12, opacity: 0.6, width: 100, textAlign: "right" },
// });

// export default HomeScreen;
