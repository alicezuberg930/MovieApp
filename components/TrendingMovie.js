import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, Text, TouchableWithoutFeedback, View } from "react-native";
import Carousel from 'react-native-snap-carousel-new';
import { image500 } from "../api/moviedb";

export default function TrendingMovies({ data }) {
    const navigation = useNavigation()
    const onPress = (item) => {
        navigation.navigate('MovieDetails', item)
    }

    return (
        <View className="mb-8">
            <Text className="text-white text-xl mx-4 mb-5">Trending movies</Text>
            <Carousel
                data={data}
                renderItem={({ item }) => <MovieCard item={item} onPress={onPress} />}
                firstItem={1}
                inactiveSlideOpacity={0.6}
                sliderWidth={width}
                itemWidth={width * 0.62}
                slideStyle={{ display: 'flex', alignItems: 'center' }} />
        </View>
    )
}

const { width, height } = Dimensions.get('window')
const MovieCard = ({ item, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onPress(item)}>
            <Image source={{ uri: image500(item.poster_path) }}
                style={{
                    width: width * 0.6,
                    height: height * 0.4
                }}
                className="rounded-3xl" />
        </TouchableWithoutFeedback>
    )
}