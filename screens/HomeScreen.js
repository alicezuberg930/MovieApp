import { View, Text, Platform, StatusBar, Touchable, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { styles } from "../theme";
import TrendingMovies from "../components/TrendingMovie";
import MovieList from "../components/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from "../api/moviedb";

const ios = Platform.OS == 'ios'
export default function HomeScreen() {
    const [trendings, setTrendings] = useState([])
    const [upcomings, setUpcomings] = useState([])
    const [topRateds, setTopRateds] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()

    useEffect(() => {
        getTrendingMovies()
        getUpcomingMovies()
        getTopRatedMovies()
        setLoading(false)
    }, [])

    const getTrendingMovies = async () => {
        const data = await fetchTrendingMovies()
        if (data && data.results) setTrendings(data.results)
    }
    const getUpcomingMovies = async () => {
        const data = await fetchUpcomingMovies()
        if (data && data.results) setUpcomings(data.results)
    }
    const getTopRatedMovies = async () => {
        const data = await fetchTopRatedMovies()
        if (data && data.results) setTopRateds(data.results)
    }
    return (
        <View className="flex-1 bg-neutral-800">
            <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
                <StatusBar barStyle="light" />
                <View className="flex-row justify-between items-center mx-4">
                    <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
                    <Text className="text-white text-3xl font-bold"><Text style={styles.text}>M</Text>ovies</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {
                loading ? (<Loading />) :
                    (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 10 }}>
                            {/* trending movies carousel */}
                            <TrendingMovies data={trendings} />
                            {/* upcoming movies */}
                            <MovieList title="Upcoming" data={upcomings} />
                            {/* top rated movies */}
                            <MovieList title="Top rated" data={topRateds} />
                        </ScrollView>
                    )
            }
        </View>
    )
}