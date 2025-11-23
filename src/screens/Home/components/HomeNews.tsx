import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '../../../utils/ColorTheme';

const DATA = [
  {
    id: '1',
    title:
      'NEPSE Concludes The Week With 0.57% Gain and Turnover of Rs 20.41 Arba; Weekly Summary with Sector Comparison, Major Highlights, and More',
    time: '1h ago',
    tag: 'Nepse',
    img: require('../../../assets/dummy/dummy3.jpg'),
  },
  {
    id: '2',
    title:
      'Super Madi Hydropower Limited Proposes to Issue 50% Right Shares; Decision Subject to Approval from ERC',
    time: '2h ago',
    tag: 'IPO',
    img: require('../../../assets/dummy/dummy2.jpg'),
  },
  {
    id: '3',
    title: 'Unilever Nepal Confirms NPR 1,842 Per Share Dividend at 32nd AGM',
    time: '5h ago',
    tag: 'Dividend',
    img: require('../../../assets/dummy/dummy1.jpg'),
  },
];

const HomeNews = () => {
  const { colors } = useThemeColors();

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Image source={item.img} style={styles.image} />

      <View style={styles.content}>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={[styles.title, { color: colors.text }]}
        >
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.time, { color: colors.text }]}>{item.time}</Text>
          <Text style={[styles.tag, { color: colors.tag }]}> • {item.tag}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.header,{color:colors.text}]}>Top News</Text>

      <FlashList
        data={DATA}
        renderItem={renderItem}
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeNews;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  time: {
    fontSize: 14,
  },
  tag: {
    fontSize: 14,
    fontWeight: '500',
  },
});
