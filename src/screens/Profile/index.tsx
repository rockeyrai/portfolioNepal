import {
  ChevronRight,
  IdCardLanyard,
  Key,
  Lock,
  Power,
  User,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../utils/ColorTheme";
import ExpandCard from "../../components/cards/ExpandCard";
import Slicecard from "../../components/cards/SliceCard";
import ThemeToggle from "../../components/ui/CustomeThemeToggle";

interface Section {
  id: string;
  title: string;
  icon: any;
  items: { label: string; value: string }[];
}

const ProfileScreen=()=> {
  const { colors } = useThemeColors();

  const sections: Section[] = [
    {
      id: "basic_info",
      title: "My Information",
      icon: User,
      items: [
        { label: "Work Account", value: "john.work@company.com" },
        { label: "Secondary Email", value: "j.doe@personal.com" },
        { label: "Business Profile", value: "JD Consulting" },
        { label: "Linked Accounts", value: "2 connected" },
      ],
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[styles.root, { backgroundColor: colors.secondBackground }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 16 }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Profile
          </Text>
        </View>

        {/* Profile Picture and Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View
              style={[styles.avatar, { backgroundColor: colors.secondary }]}
            >
              <User size={48} color={colors.card} />
            </View>
          </View>
          <Text style={[styles.name, { color: colors.text }]}> Rockey Rai</Text>
          <Text style={[styles.member, { color: colors.secondaryText }]}>
            Premium Member
          </Text>
        </View>
      </View>
      <ExpandCard/>

      {/* Sections Container */}
      <ThemeToggle />
      {/* <View className="flex flex-row justify-between items-center px-4 pr-10 ">
        <Text style={[{ color: colors.text }]}>Active Status</Text>
        <Text
          style={[{ fontWeight: 600, fontSize: 14, color: colors.positive }]}
        >
          ON
        </Text>
    
      </View> */}
      <View style={{ marginTop: 0, paddingHorizontal: 16 }}>
        {/* Basic Information */}
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
          Basic Information
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Slicecard sections={sections} />

          <TouchableOpacity
            style={[styles.itemButton, { backgroundColor: colors.card }]}
          >
            <View style={[styles.iconContainer]}>
              <IdCardLanyard size={20} color={colors.secondaryText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                My Subscription{" "}
              </Text>
              <Text
                style={[
                  styles.itemDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Manage your subscription plan{" "}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
          Security Settings
        </Text>
        {/* Security Settings */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {[
            {
              id: "security",
              title: "Password & Security",
              desc: "Manage your password and 2FA",
              icon: Lock,
              color: "#A855F7",
            },
            {
              id: "sessions",
              title: "Active Sessions",
              desc: "View and manage your devices",
              icon: Key,
              color: "#10B981",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemButton, { backgroundColor: colors.card }]}
              >
                <View style={[styles.iconContainer]}>
                  <Icon size={20} color={colors.secondaryText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.itemDescription,
                      { color: colors.secondaryText },
                    ]}
                  >
                    {item.desc}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.muted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

export default  ProfileScreen;
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    // paddingHorizontal: 16,
    paddingTop: 10,
    // paddingBottom: 20,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  profileSection: { alignItems: "center" },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: { fontSize: 20, fontWeight: "bold", marginTop: 12 },
  member: { fontSize: 13, marginTop: 2 },
  card: {
    borderRadius: 16,
    padding: 6,
    // marginBottom: 16,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 2,
  },
  sectionTitle: { fontSize: 12, fontWeight: "400", marginBottom: 4 ,marginTop:15},
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    // paddingHorizontal: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemTitle: { fontSize: 14, fontWeight: "400" },
  itemDescription: { fontSize: 12, marginTop: 0 },
  expandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  expandHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconContainerSmall: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
  },
  expandTitle: { fontSize: 15, fontWeight: "600" },
  expandContent: { borderTopWidth: 1, marginTop: 4, paddingTop: 8 },
  expandRow: { paddingVertical: 8 },
  expandRowText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expandLabel: { fontSize: 13 },
  expandValue: { fontSize: 13, fontWeight: "500" },
  divider: { height: 1, marginTop: 8 },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: { fontWeight: "600" },
});