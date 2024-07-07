import React from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185 } from "../api/moviedb";

const { width, height } = Dimensions.get('window')
export default function MovieList({ title, data, hideSeeAll, type }) {
    const navigation = useNavigation()
    return (
        <View className="mb-8 space-y-4">
            <View className="mx-4 flex-row justify-between items-center">
                <Text className="text-white text-xl">{title}</Text>
                {
                    !hideSeeAll ? (
                        <TouchableOpacity>
                            <Text style={styles.text} className="text-lg">See all</Text>
                        </TouchableOpacity>
                    ) : null
                }
            </View>
            <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}>
                {
                    data.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={index}
                                onPress={() => type == "tv" ? navigation.navigate('TvSeriesDetails', item) : navigation.navigate('MovieDetails', item)}
                            >
                                <View className="space-y-1 mr-4">
                                    <Image source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                                        className="rounded-3xl"
                                        style={{ width: width * 0.33, height: height * 0.22 }} />
                                    <Text className="text-neutral-300 ml-1">
                                        {type == "movie" ? item.title.length > 14 ? item.title.slice(0, 14) + '...' : item.title :
                                            item.name?.length > 14 ? item.name?.slice(0, 14) + '...' : item.name}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
} 