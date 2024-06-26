import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'flower' : 'flower-outline'} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="recipes"
				options={{
					title: 'Recipes',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'rose' : 'rose-outline'} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="ailments"
				options={{
					title: 'Ailments',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'heart-circle' : 'heart-circle-outline'} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
