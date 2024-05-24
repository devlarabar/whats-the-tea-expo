import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ActivityIndicator, Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

async function loadDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
		await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
	}
	const asset = await Asset.fromModule(require("../assets/data/db.db")).downloadAsync();
	if (!asset.localUri) {
		throw new Error("Failed to download database asset.");
	}
	await FileSystem.copyAsync({
		from: asset.localUri,
		to: FileSystem.documentDirectory + 'SQLite/db.db',
	});

	return SQLite.openDatabaseSync('db.db');
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		LightStories: require('../assets/fonts/LightStories.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	const [dbLoaded, setDbLoaded] = useState<Boolean>(false);

	useEffect(() => {
		loadDatabase().then(() => setDbLoaded(true))
			.catch((e) => console.error(e));
	})

	if (!dbLoaded || !loaded) {
		return (
			<View style={{ flex: 1 }}>
				<ActivityIndicator size={"large"} />
				<Text>Loading...</Text>
			</View>
		)
	}

	return (
		<Suspense
			fallback={
				<View style={{ flex: 1, backgroundColor: "red" }}>
					<ActivityIndicator size={"large"} />
					<Text>Loading...</Text>
				</View>
			}>
			<SQLiteProvider databaseName='db.db' useSuspense>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
				</ThemeProvider>
			</SQLiteProvider>
		</Suspense>
	);
}
