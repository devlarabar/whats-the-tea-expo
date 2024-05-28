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
import { ExternalLink } from '@/components/ExternalLink';
import { Collapsible } from '@/components/Collapsible';

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
				<ThemedText type="subtitle">Step 1: Select your ailments</ThemedText>
				<ThemedText>
					Head over to the <ThemedText type="defaultSemiBold">Ailments</ThemedText> tab to select what's troubling you.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 2: Generate your recipe</ThemedText>
				<ThemedText>
					Click the <ThemedText type="defaultSemiBold">Get Recipe</ThemedText> button to generate an herbal tea recipe to help soothe your symptoms.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 3: Save your favourites</ThemedText>
				<ThemedText>
					Every recipe you generate is saved in your local database. You can browse the list and save your favourites for easy access whenever you need them.
				</ThemedText>
			</ThemedView>
			<Collapsible title="Light and dark mode components">
				<ThemedText>
					This template has light and dark mode support. The{' '}
					<ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
					what the user's current color scheme is, and so you can adjust UI colors accordingly.
				</ThemedText>
				<ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
					<ThemedText type="link">Learn more</ThemedText>
				</ExternalLink>
			</Collapsible>
			<Collapsible title="Animations">
				<ThemedText>
					This template includes an example of an animated component. The{' '}
					<ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
					the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
					to create a waving hand animation.
				</ThemedText>
				{Platform.select({
					ios: (
						<ThemedText>
							The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
							component provides a parallax effect for the header image.
						</ThemedText>
					),
				})}
			</Collapsible>
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
