import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Herb } from '@/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Style from '@/components/ui/Style';

export default function HomeScreen() {

	const colorScheme = useColorScheme();

	const [herbs, setHerbs] = useState<Herb[]>([])

	const db = useSQLiteContext();


	// Can put these in a constants / JSON file
	const getConstantData = async () => {
		const herbData = await db.getAllAsync<Herb>(
			`SELECT * FROM Herb ORDER BY name ASC;`
		);
		setHerbs(herbData);
	}
	useEffect(() => {
		db.withTransactionAsync(async () => {
			await getConstantData();
		})
	}, [db])

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: Colors.light.accent1, dark: Colors.dark.accent1 }}
			headerImage={<Ionicons size={310} name="flower-outline" style={{ ...Style.headerImage, color: Colors[colorScheme ?? 'light'].accent2 }} />}>
			{/* {herbs && herbs.map((herb, index) => {
				return <Text key={index}>{herb.name}</Text>
			})} */}
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome!</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 1: Try it</ThemedText>
				<ThemedText>
					Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
					Press{' '}
					<ThemedText type="defaultSemiBold">
						{Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
					</ThemedText>{' '}
					to open developer tools.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 2: Explore</ThemedText>
				<ThemedText>
					Tap the Explore tab to learn more about what's included in this starter app.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					When you're ready, run{' '}
					<ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
					<ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
					<ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
					<ThemedText type="defaultSemiBold">app-example</ThemedText>.
				</ThemedText>
			</ThemedView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
});
