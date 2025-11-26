import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeColors } from '../../utils/ColorTheme';
import { Text, View } from 'react-native';


type FilterType = 'Today' | 'Weeak' | 'Month';

interface DropdownProps {
  filterOptions: { label: string; value: FilterType }[];
  selectedFilter: FilterType;
  setselectedFilter: (value: FilterType) => void;
  dropDownWith: number 
}

const CustomeDropdown: React.FC<DropdownProps> = ({
  filterOptions,
  selectedFilter,
  setselectedFilter,
  dropDownWith
}) => {
  const { colors } = useThemeColors();

  return (
    <View style={{width:dropDownWith}}>
    <Dropdown
      data={filterOptions}
      labelField="label"
      valueField="value"
      value={selectedFilter}
      onChange={item => setselectedFilter(item.value)}
      placeholder="Filter"
      iconColor={colors.text}
      style={{
        // borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: "100%",
        backgroundColor: colors.secondBackground,
      }}
      activeColor={colors.tabActive}
      containerStyle={{
        backgroundColor: colors.secondBackground,
        borderRadius: 10,
        borderColor: colors.secondBackground,
        overflow: 'hidden',
      }}
      selectedTextStyle={{ color: colors.text, fontSize: 12 }}
      placeholderStyle={{ color: colors.text }}
      renderItem={item => {
        console.log('itsem', item);
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 4,
            }}
          >
            {/* Example: You can add an icon or colored dot */}
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.secondBackground,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
              }}
            >
              {item?.label}
            </Text>
          </View>
        );
      }}
    />
    </View>

  );
};

export default CustomeDropdown;
