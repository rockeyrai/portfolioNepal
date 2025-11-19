// import React, { useRef, useState, useEffect, useMemo } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   Pressable,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import { useThemeColors } from "../../utils/ColorTheme";
// import { Search } from "lucide-react-native";

// type Option = {
//   id: number;
//   name: string;
//   symbol: string;
//   sector?: string;
// };

// type Props = {
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder?: string;
//   maxWidth?: number;
//   onFocusChange?: (focused: boolean) => void;
//   options?: Option[];
//   loading?: boolean;
// };

// export default function ExpandingInput({
//   value,
//   onChangeText,
//   placeholder = "Search...",
//   maxWidth = 0,
//   onFocusChange,
//   options = [],
//   loading = false,
// }: Props) {
//   const { colors } = useThemeColors();
//   const [focused, setFocused] = useState(false);
//   const widthAnim = useRef(new Animated.Value(40)).current;
//   const inputRef = useRef<TextInput | null>(null);

//   // animate width
//   const animateWidth = (toValue: number) => {
//     Animated.timing(widthAnim, {
//       toValue,
//       duration: 280,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: false,
//     }).start();
//   };

//   const handleFocus = () => {
//     setFocused(true);
//     animateWidth(maxWidth);
//     onFocusChange?.(true);
//   };

//   const handleBlur = () => {
//     // dropdown should NOT close on blur
//     if (!focused) return;
//   };

//   const handleIconPress = () => {
//     if (focused) {
//       // close
//       setFocused(false);
//       animateWidth(40);
//       onFocusChange?.(false);
//       inputRef.current?.blur();
//     } else {
//       inputRef.current?.focus();
//       handleFocus();
//     }
//   };

//   const filteredOptions = useMemo(() => {
//     if (!value) return options;
//     const q = value.toLowerCase();
//     return options.filter(
//       (o) =>
//         o.name?.toLowerCase().includes(q) ||
//         o.symbol?.toLowerCase().includes(q) ||
//         (o.sector && o.sector.toLowerCase().includes(q))
//     );
//   }, [value, options]);

//   return (
//     <View style={styles.outsideWrapper}>
//       {focused && (
//         <Pressable
//           style={styles.overlay}
//           onPress={() => {
//             setFocused(false);
//             animateWidth(40);
//             inputRef.current?.blur();
//             onFocusChange?.(false);
//           }}
//         />
//       )}

//       <Animated.View
//         style={[
//           styles.inputContainer,
//           { width: widthAnim, backgroundColor: colors.card },
//         ]}
//       >
//         <TouchableOpacity style={styles.icon} onPress={handleIconPress}>
//           <Search size={20} color={colors.text} />
//         </TouchableOpacity>

//         <TextInput
//           ref={inputRef}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={colors.secondaryText}
//           style={[styles.input, { color: colors.text }]}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//         />
//       </Animated.View>

//       {/* Dropdown UI */}
//       {focused && (
//         <View style={styles.dropdownContainer}>
//           <Dropdown
//             data={filteredOptions}
//             labelField="name"
//             valueField="symbol"
//             search={false}
//             value={null}
//             placeholder=""
//             onChange={(item) => {
//               onChangeText(item.name);
//               setFocused(false);
//               animateWidth(40);
//               inputRef.current?.blur();
//               onFocusChange?.(false);
//             }}
//             containerStyle={{
//               backgroundColor: colors.card,
//               borderRadius: 8,
//               borderWidth: 1,
//               borderColor: colors.border,
//             }}
//             style={{
//               backgroundColor: colors.card,
//               borderRadius: 8,
//               borderColor: colors.border,
//               borderWidth: 1,
//               height: "auto",
//             }}
//             renderItem={(item) => (
//               <View style={{ padding: 10 }}>
//                 <Text style={{ color: colors.text }}>
//                   {item.name} ({item.symbol})
//                 </Text>
//               </View>
//             )}
//             flatListProps={{
//               nestedScrollEnabled: true,
//             }}
//             maxHeight={260}
//           />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   outsideWrapper: {
//     position: "relative",
//     zIndex: 100,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     top: 0,
//     left: 0,
//     zIndex: 1,
//   },
//   inputContainer: {
//     height: 40,
//     borderRadius: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     zIndex: 20,
//   },
//   icon: {
//     marginLeft: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     paddingLeft: 6,
//   },
//   dropdownContainer: {
//     position: "absolute",
//     top: 48,
//     left: 0,
//     right: 0,
//     zIndex: 30,
//   },
// });