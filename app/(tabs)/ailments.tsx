import { Image, StyleSheet, Platform, Text, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Herb } from '@/types';
import { Ailments } from '@/constants/Ailments';
import { Ionicons } from '@expo/vector-icons';
import Error from '@/components/ui/Error';

export default function AilmentsScreen() {

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
    const getRecipe = async (selectedAilments: string[]) => {
        let query: string = `SELECT * FROM Herb WHERE`;
        query += selectedAilments.map(a => ` uses LIKE '%${a}%'`).join(' OR ');
        const recipeHerbs: Herb[] = await db.getAllAsync<Herb>(query);
        setRecipe(recipeHerbs);
    }


    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FAE7F4', dark: '#DDABC2' }}
            headerImage={<Ionicons size={310} name="heart-outline" style={styles.headerImage} />}>
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
                        <Button
                            title={"Start over"}
                            onPress={() => {
                                setRecipe([])
                                setSelectedAilments([])
                            }}
                            accessibilityLabel="Start over"
                        />
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
                                    style={selectedAilments.includes(ailmentName) ? styles.ailmentsListItemSelected : styles.ailmentsListItem}
                                    key={index}
                                >
                                    <Ionicons size={15} name={selectedAilments.includes(ailmentName) ? "checkmark-circle-outline" : "ellipse-outline"} style={styles.selectButton} /> {ailmentName}
                                </ThemedText>
                            })}
                        </ThemedView>
                        <ThemedView>
                            <Button
                                title={"Get Recipe"}
                                onPress={() => getRecipe(selectedAilments)}
                                accessibilityLabel="Get recipe"
                            />
                        </ThemedView>
                    </ThemedView>
                )}

        </ParallaxScrollView>
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
    headerImage: {
        color: "#AF4670",
        bottom: -90,
        left: -35,
        position: "absolute",
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
        backgroundColor: "#AF4670",
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    ailmentsListItemSelected: {
        backgroundColor: "#E3D2DE",
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
