import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import FallbackLogo from '../../../assets/logo/portfolio.png'; // FIXED IMPORT

const CompanyRow = ({ item, colors, logoBaseURL }) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = `${logoBaseURL}/${item.symbol}.webp`;

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom:4,
        backgroundColor: colors.secondBackground,
      }}
    >
      {/* Left: Logo */}
      <View
        style={{
          width: '15%',
          alignItems: 'center',
          backgroundColor: colors.secondBackground,
          borderRadius: 25,
          padding: 2,
          aspectRatio: 1,
          justifyContent: 'center',
        }}
      >
        <Image
          source={imageError ? FallbackLogo : { uri: logoUrl }}
          onError={() => setImageError(true)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 25,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Middle: Text Section */}
      <View style={{ width: '75%', paddingHorizontal: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}
          >
            {item.symbol}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              backgroundColor: colors.secondBackground,
              paddingVertical: 1,
              paddingHorizontal: 4,
              borderRadius: 10,
            }}
          >
            {item.sectorName}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: colors.text + 'AA',
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
          }}
        >
          {item.companyName}
        </Text>
      </View>

      {/* Right: Bookmark */}
      <TouchableOpacity
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => console.log('Bookmarked:', item.symbol)}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.secondBackground + '60',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Plus size={20} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyRow;
