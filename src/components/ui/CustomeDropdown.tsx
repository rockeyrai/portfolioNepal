import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeColors } from '../../utils/ColorTheme';
import { Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface DropdownProps {
  filterOptions: { label: string; value: any }[];
  selectedFilter: any;
  setselectedFilter: (value: any) => void;
  dropDownWith: number;
  placeHolder: string;
  paddingH?: number;
  paddingV?: number;
  leftIcon: boolean;
  propBackground: string;
}

const CustomeDropdown: React.FC<DropdownProps> = ({
  filterOptions,
  selectedFilter,
  setselectedFilter,
  dropDownWith,
  placeHolder,
  paddingV = 6,
  paddingH = 10,
  leftIcon,
  propBackground,
}) => {
  const { colors } = useThemeColors();

  console.log('dorpdown fucntion option', filterOptions);
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red',
      }}
    >
      <Dropdown
        data={filterOptions}
        labelField="label"
        valueField="value"
        value={selectedFilter}
        renderRightIcon={() => {
          return leftIcon ? (
            <ChevronDown color={colors.text} size={15} />
          ) : null;
        }}
        // renderRightIcon={false}
        onChange={item => setselectedFilter(item.value)}
        placeholder={placeHolder}
        iconColor={colors.text}
        style={{
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          width: dropDownWith,
          borderColor: propBackground,
          backgroundColor: propBackground,

          height: 30,
        }}
        activeColor={colors.tabActive}
        containerStyle={{
          backgroundColor: colors.secondBackground,
          borderRadius: 10,
          borderColor: colors.secondBackground,
          overflow: 'hidden',
          width: dropDownWith,
        }}
        selectedTextStyle={{ color: colors.text, fontSize: 12 }}
        placeholderStyle={{ color: colors.text, textAlign: 'center' }}
        renderItem={item => {
          console.log('itsem', item);
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
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
