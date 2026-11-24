
import { Tabs } from 'expo-router';

import {
  Home,
  Heart,
  Package,
  UserRound,
} from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#15803D',
        tabBarInactiveTintColor: '#94A3B8',

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 3,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },

        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 9,
          paddingHorizontal: 5,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F1',
          elevation: 12,
          shadowColor: '#000000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: -3,
          },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <Home
              color={color}
              size={23}
              strokeWidth={focused ? 2.7 : 1.8}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, focused }) => (
            <Heart
              color={color}
              size={23}
              strokeWidth={focused ? 2.7 : 1.8}
              fill={focused ? '#DCFCE7' : 'transparent'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="my-products"
        options={{
          title: 'Mes produits',
          tabBarIcon: ({ color, focused }) => (
            <Package
              color={color}
              size={23}
              strokeWidth={focused ? 2.7 : 1.8}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <UserRound
              color={color}
              size={23}
              strokeWidth={focused ? 2.7 : 1.8}
            />
          ),
        }}
      />
    </Tabs>
  );
}
