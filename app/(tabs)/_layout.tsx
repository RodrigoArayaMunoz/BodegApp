import { Tabs } from "expo-router";
import { Edit3, Package, Search } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function TabLayout() {
  

  return (
    <SafeAreaProvider>

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"/>
      </View>


          <Tabs
      screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
      }}>


            <Tabs.Screen
        name="index"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

            <Tabs.Screen
        name="Update"
        options={{
          title: 'Modificación',
          tabBarIcon: ({ color, size }) => <Edit3 size={size} color={color}/>,
        }}
      />

            <Tabs.Screen
        name="Upload"
        options={{
          title: 'Carga Inventario',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color}  />,
        }}
      />

        </Tabs>
        </View>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    height: 60,
    width: 200,
  },
  tabBar: {
    position: "absolute",
    bottom: 50,
    left: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 5,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
})
