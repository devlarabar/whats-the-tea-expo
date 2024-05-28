import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { Herb, Recipe } from '@/types';
import { Colors } from '@/constants/Colors';
import Style from '@/components/ui/Style';

export default function TabTwoScreen() {

	const colorScheme: string = useColorScheme() ?? "light";


	const [herbs, setHerbs] = useState<Herb[]>([])
	const [recipes, setRecipes] = useState<Recipe[]>([])

	const db = useSQLiteContext();


	// Can put these in a constants / JSON file
	const getRecipeData = async () => {
		const recipeData = await db.getAllAsync<Recipe>(
			`SELECT * FROM Recipe ORDER BY id DESC;`
		);
		setRecipes(recipeData);
	}
	useEffect(() => {
		db.withTransactionAsync(async () => {
			await getRecipeData();
		})
	}, [db])

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: Colors.light.accent1, dark: Colors.dark.accent1 }}
			headerImage={<Ionicons size={310} name="rose-outline" style={{ ...Style.headerImage, color: Colors[colorScheme].accent2 }} />}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Recipes</ThemedText>
			</ThemedView>
			<ThemedText>This app includes example code to help you get started.</ThemedText>
			<ThemedView style={{ ...styles.recipesContainer }}>
				{recipes.length > 0 ? recipes.map((recipe, index) => {
					return (
						<ThemedView style={{ ...styles.recipe, backgroundColor: "#ffffff" }}>
							<ThemedView style={{ ...styles.recipeHerbs, backgroundColor: "transparent" }} key={index}>{recipe.herbs.split(",").map((herb, index) => {
								return (
									<ThemedText key={`${herb}${index}`}>{herb}</ThemedText>
								)
							})}
							</ThemedView>
							<Ionicons size={20} name="bookmark-outline" style={{ color: Colors[colorScheme].accent2 }} />
						</ThemedView>
					)
				})
					:
					<ThemedText>There are no recipes.</ThemedText>

				}
			</ThemedView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	recipesContainer: {
		flexDirection: "column",
		gap: 8,
		marginTop: 50,
	},
	recipeHerbs: {
		flexDirection: 'row',
		gap: 8,
	},
	recipe: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 8,
		borderRadius: 8,
	}
});
