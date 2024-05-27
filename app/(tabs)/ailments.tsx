import { Image, StyleSheet, Platform, Text, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ColorsDict, Herb, Recipe } from '@/types';
import { Ailments } from '@/constants/Ailments';
import { Ionicons } from '@expo/vector-icons';
import Error from '@/components/ui/Error';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import Style from '@/components/ui/Style';
import { ThemedButton } from '@/components/ui/ThemedButton';

export default function AilmentsScreen() {
    const colorScheme = useColorScheme();
    const colors: ColorsDict = Colors[colorScheme ?? 'light']

    const [herbs, setHerbs] = useState<Herb[]>([])
    const [selectedAilments, setSelectedAilments] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [recipe, setRecipe] = useState<Herb[]>([])

    // Fetch herbs
    const db = useSQLiteContext();
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

    // Functions
    const selectAilment = (ailment: string) => {
        if (selectedAilments.length < 3) {
            if (selectedAilments.includes(ailment)) {
                setErrorMessage(`You have already selected ${ailment}`);
            } else {
                setSelectedAilments([...selectedAilments, ailment]);
                if (errorMessage) {
                    setErrorMessage("");
                }
            }
        } else {
            setErrorMessage("You may only select up to three (3) ailments.");
        }
    }
    const removeSelectedAilment = (ailment: string) => {
        setSelectedAilments(selectedAilments.filter(x => x !== ailment));
        if (errorMessage) {
            setErrorMessage("");
        }
    }
    const saveGeneratedRecipe = async (recipe: Herb[]) => {
        try {
            // Convert the recipe array to a comma-separated string
            const herbsString = recipe.map(herb => herb.name).join(",");

            // Insert the new recipe into the Recipe table
            const result = await db.runAsync(
                `INSERT INTO Recipe (name, herbs, addons, is_favourite) VALUES (?, ?, ?, ?);`,
                "", herbsString, "", 0
            );

            // Log the result for debugging
            console.log('Inserted recipe with ID:', result.lastInsertRowId);
            console.log('Number of rows affected:', result.changes);
            const insertedRecipe = await db.getAllAsync(`SELECT * FROM Recipe WHERE id = ?;`, result.lastInsertRowId)
            console.log(insertedRecipe)
        } catch (error) {
            console.error('Error inserting recipe:', error);
        }
    }
    const getRecipe = async (selectedAilments: string[]) => {
        // let query: string = `SELECT * FROM Herb WHERE`;
        // query += selectedAilments.map(a => ` uses LIKE '%${a}%'`).join(' OR ');
        // const recipeHerbs: Herb[] = await db.getAllAsync<Herb>(query);
        let recipeHerbs: Herb[] = []
        for (let a of selectedAilments) {
            let query: string = `SELECT * FROM Herb WHERE uses LIKE '%${a}%'`
            const aHerbs: Herb[] = await db.getAllAsync<Herb>(query);
            let rng = Math.floor(Math.random() * (aHerbs.length));
            recipeHerbs.push(aHerbs[rng])
        }
        const uniqueHerbs = recipeHerbs.filter((herb, index, self) =>
            index === self.findIndex((herbBeingChecked) => herbBeingChecked.name === herb.name)
        );
        saveGeneratedRecipe(uniqueHerbs);
        setRecipe(uniqueHerbs);
    }


    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: Colors.light.accent1, dark: Colors.dark.accent1 }}
            headerImage={<Ionicons size={310} name="heart-outline" style={{ ...Style.headerImage, color: colors.accent2 }} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Spill the Tea</ThemedText>
            </ThemedView>
            {recipe.length ? (
                <ThemedView style={styles.recipeContainer}>
                    {recipe.map((herb, index) => {
                        return (
                            <ThemedView key={index} style={styles.recipeHerb}>
                                <ThemedText>{herb.name.split("")[0].toUpperCase()}{herb.name.substring(1)}</ThemedText>
                                <ThemedText style={styles.herbUses}>{herb.uses}</ThemedText>
                            </ThemedView>
                        )
                    })}
                    <ThemedView>
                        <ThemedButton
                            title={"Start over"}
                            onPress={() => {
                                setRecipe([])
                                setSelectedAilments([])
                            }} />
                    </ThemedView>
                </ThemedView>
            ) :
                (
                    <ThemedView style={styles.stepContainer}>
                        <ThemedText type="subtitle">What's troubling you?</ThemedText>
                        {errorMessage && <Error errorMessage={errorMessage} />}
                        <ThemedView style={styles.ailmentsListContainer}>
                            {Ailments.map((ailmentName, index) => {
                                return <ThemedText
                                    type="defaultSemiBold"
                                    onPress={() => {
                                        if (!selectedAilments.includes(ailmentName)) {
                                            selectAilment(ailmentName)
                                        } else {
                                            removeSelectedAilment(ailmentName)
                                        }
                                    }}
                                    style={
                                        selectedAilments.includes(ailmentName)
                                            ? { ...styles.ailmentsListItem, backgroundColor: colors.accent3, color: colors.text }
                                            : { ...styles.ailmentsListItem, backgroundColor: colors.primary }
                                    }
                                    key={index}
                                >
                                    <Ionicons
                                        size={15}
                                        name={selectedAilments.includes(ailmentName)
                                            ? "checkmark-circle-outline"
                                            : "ellipse-outline"}
                                        style={styles.selectButton}
                                    /> {ailmentName}
                                </ThemedText>
                            })}
                        </ThemedView>
                        <ThemedView>
                            <ThemedButton
                                title={"Get Recipe"}
                                onPress={() => getRecipe(selectedAilments)}
                                disabled={selectedAilments.length > 0 ? false : true}
                            />
                        </ThemedView>
                    </ThemedView>
                )
            }

        </ParallaxScrollView >
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    selectButton: {
        flex: 1
    },
    ailmentsListContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    ailmentsListItem: {
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    recipeContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    recipeHerb: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    herbUses: {
        fontStyle: "italic",
    }
});
