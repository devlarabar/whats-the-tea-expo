import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next';
import Home from './screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

async function loadDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        const asset = await Asset.fromModule(require("./assets/db.db")).downloadAsync();
        await FileSystem.copyAsync({
            from: asset.localUri,
            to: FileSystem.documentDirectory + 'SQLite/db.db',
        });
    }

    return SQLite.openDatabase('db.db');
}

export default function App() {

    const [fontsLoaded] = useFonts({
        'DePixel': require('./assets/fonts/DePixelHalbfett.otf'),
    });

    const [dbLoaded, setDbLoaded] = useState<Boolean>(false);

    useEffect(() => {
        loadDatabase().then(() => setDbLoaded(true))
            .catch((e) => console.error(e));
    })

    if (!dbLoaded) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator size={"large"} />
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Suspense
                fallback={
                    <View style={{ flex: 1, backgroundColor: "red" }}>
                        <ActivityIndicator size={"large"} />
                        <Text>Loading...</Text>
                    </View>
                }>
                <SQLiteProvider databaseName='db.db' useSuspense>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{
                                headerTitle: "Starfield Companion",
                                headerLargeTitle: true
                            }}
                        />
                    </Stack.Navigator>
                </SQLiteProvider>
            </Suspense>
        </NavigationContainer>


    );
}

