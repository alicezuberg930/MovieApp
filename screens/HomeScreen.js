import { View, Text, Platform, StatusBar, Touchable, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { styles } from "../theme";
import TrendingMovies from "../components/TrendingMovie";
import MovieList from "../components/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { fetchAiringTodayTvSeries, fetchOnTheAirTvSeries, fetchPopularTvSeries, fetchTopRatedMovies, fetchTopRatedTvSeries, fetchTrendingMovies, fetchTrendingTvSeries, fetchUpcomingMovies } from "../api/moviedb";

const ios = Platform.OS == 'ios'
export default function HomeScreen() {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [upcomingMovies, setUpcomingMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [trendingTvSeries, setTrendingTvSeries] = useState([])
    const [onTheAirTvSeries, setOnTheAirTvSeries] = useState([])
    const [airingTodayTvSeries, setAiringTodayTvSeries] = useState([])
    const [popularTvSeries, setPopularTvSeries] = useState([])
    const [topRatedTvSeries, setTopRatedTvSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()

    useEffect(() => {
        // movies
        // getTrendingMovies()
        // getUpcomingMovies()
        // getTopRatedMovies()
        
        // tv series
        // getTrendingTvSeries()
        // getOnTheAirTvSeries()
        // getAiringTodayTvSeries()

        setLoading(false)
    }, [])

    // movies
    const getTrendingMovies = async () => {
        const data = await fetchTrendingMovies()
        if (data && data.results) setTrendingMovies(data.results)
    }
    const getUpcomingMovies = async () => {
        const data = await fetchUpcomingMovies()
        if (data && data.results) setUpcomingMovies(data.results)
    }
    const getTopRatedMovies = async () => {
        const data = await fetchTopRatedMovies()
        if (data && data.results) setTopRatedMovies(data.results)
    }
    // tv series 
    const getTrendingTvSeries = async () => {
        const data = await fetchTrendingTvSeries()
        console.log(data);
        if (data && data.results) setTrendingTvSeries(data.results)
    }
    const getOnTheAirTvSeries = async () => {
        const data = await fetchOnTheAirTvSeries()
        if (data && data.results) setOnTheAirTvSeries(data.results)
    }
    const getAiringTodayTvSeries = async () => {
        const data = await fetchAiringTodayTvSeries()
        if (data && data.results) setAiringTodayTvSeries(data.results)
    }
    const getPopularTvSeries = async () => {
        const data = await fetchPopularTvSeries()
        if (data && data.results) setPopularTvSeries(data.results)
    }
    const getTopRatedTvSeries = async () => {
        const data = await fetchTopRatedTvSeries()
        if (data && data.results) setTopRatedTvSeries(data.results)
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
                            contentContainerStyle={{ paddingBottom: 10 }}
                        >
                            {/* trending movies carousel */}
                            <TrendingMovies title="Trending movies" data={trendingMovies} />
                            {/* upcoming movies */}
                            <MovieList title="Upcoming movies" type="movie" data={upcomingMovies} />
                            {/* top rated movies */}
                            <MovieList title="Top rated movies" type="movie" data={topRatedMovies} />
                            {/*-----------------------------------------*/}
                            {/* trending tv series carousel */}
                            <TrendingMovies title="Trending TV shows" data={trendingTvSeries} />
                            {/* on the air tv series */}
                            <MovieList title="On the air" type="tv" data={onTheAirTvSeries} />
                            {/* airing today tv series */}
                            <MovieList title="Airing today" type="tv" data={airingTodayTvSeries} />
                        </ScrollView>
                    )
            }
        </View>
    )
}
// trendingTvSeries
// onTheAirTvSeries
// airingTodayTvSeries
// popularTvSeries
// topRatedTvSeries