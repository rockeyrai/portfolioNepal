import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useThemeColors } from "../../utils/ColorTheme";

// ---- Types ----
interface SectionItem {
  label: string;
  value: string;
}

interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  items: SectionItem[];
}

interface SliceCardProps {
  sections: Section[];
}

// ---- Enable LayoutAnimation on Android ----
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---- Component ----
const Slicecard: React.FC<SliceCardProps> = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const {colors} = useThemeColors();

  const toggleSection = (sectionId: string) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    LayoutAnimation.configureNext({
  duration: 10000, // 👈 control height animation speed here (ms)
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity, // affects smoothness
  },
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleY, // entry animation
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleY, // exit animation
  },
});

    setExpandedSections((prev) => {
      const updated = new Set(prev);
      updated.has(sectionId) ? updated.delete(sectionId) : updated.add(sectionId);
      return updated;
    });
  };

  return (
    <View >
      {sections.map((section) => {
        const Icon = section.icon;
        const isExpanded = expandedSections.has(section.id);
        const fadeAnim = useRef(new Animated.Value(0)).current;

        // Animate opacity when expanded/collapsed
        useEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }, [isExpanded]);

        return (
          <View
            key={section.id}
            style={[
            //   styles.card,
              {
                // backgroundColor: colors.card,
                // shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Header */}
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              style={styles.expandHeader}
              activeOpacity={0.7}
            >
              <View style={styles.expandHeaderLeft}>
                <View
                  style={[
                    styles.iconContainerSmall,
                    // { backgroundColor: colors.primary },
                  ]}
                >
                  <Icon size={20} color={colors.secondaryText} />
                </View>
                <Text style={[styles.expandTitle, { color: colors.text }]}>
                  {section.title}
                </Text>
              </View>

              {isExpanded ? (
                <ChevronUp size={20} color={colors.muted} />
              ) : (
                <ChevronDown size={20} color={colors.muted} />
              )}
            </TouchableOpacity>

            {/* Animated Expandable Content */}
            {isExpanded && (
              <Animated.View
                style={[
                  styles.expandContent,
                  {
                    borderTopColor: colors.border,
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {section.items.map((item, idx) => (
                  <View key={idx} style={styles.expandRow}>
                    <View style={styles.expandRowText}>
                      <Text
                        style={[
                          styles.expandLabel,
                          { color: colors.secondaryText },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={[
                          styles.expandValue,
                          { color: colors.text },
                        ]}
                      >
                        {item.value}
                      </Text>
                    </View>
                    {idx < section.items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </Animated.View>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ---- Styles ----
const styles = StyleSheet.create({
  card: {
    padding: 2,
    borderRadius: 12,
    // marginBottom: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  expandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  expandHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainerSmall: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  expandTitle: { fontSize: 14, fontWeight: "400" },
  expandContent: {
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 8,
    paddingHorizontal:4
  },
  expandRow: { paddingVertical: 4 },
  expandRowText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expandLabel: { fontSize: 12 },
  expandValue: { fontSize: 12, fontWeight: "400" },
  divider: { height: 1, marginTop: 8 },
});

export default Slicecard;