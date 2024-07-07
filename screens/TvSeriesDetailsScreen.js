import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, Dimensions, Image, Platform, ScrollView, Touchable, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid"
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, theme } from "../theme";
import LinearGradient from "react-native-linear-gradient";
import Cast from "../components/Cast";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import { fallbackMoviePoster, fetchMovieCredits, fetchSimilarMovies, fetchSimilarTvSeries, fetchTvSeriesCredits, fetchTvSeriesDetails, fetchTvSeriesVideos, image185, image500 } from "../api/moviedb";
import { VideoList } from "../components/VideoList";

const { width, height } = Dimensions.get('window')
const ios = Platform.OS == 'ios'
const topMargin = ios ? '' : 'mt-3'
export default function TvSeriesDetailsScreen() {
    const { params: item } = useRoute()
    const [isFavorite, toggleFavorite] = useState(false)
    const [cast, setCast] = useState([])
    const [similarTvSeries, setSimilarTvSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const [tvSeries, setTvSeries] = useState({})
    const [videos, setVideos] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        getTvSeriesDetails(item.id)
        getTvSeriesCredits(item.id)
        getSimilarTvSeries(item.id)
        getTvSeriesVideos(item.id)
        setLoading(false)
    }, [item])

    const getTvSeriesDetails = async (id) => {
        const data = await fetchTvSeriesDetails(id)
        if (data) setTvSeries(data)
    }

    const getTvSeriesCredits = async (id) => {
        const data = await fetchTvSeriesCredits(id)
        if (data && data.cast) setCast(data.cast)
    }

    const getSimilarTvSeries = async (id) => {
        const data = await fetchTvSeriesVideos(id)
        if (data && data.results) setVideos(data.results)
    }

    const getTvSeriesVideos = async (id) => {
        const data = await fetchTvSeriesVideos(id)
        if (data && data.results) setVideos(data.results)
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 bg-neutral-900"
        >
            {/* back button + movie poster */}
            <View className="w-full">
                <SafeAreaView className={"absolute z-20 w-full flex-row justify-between items-center px-4 " + topMargin}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                        <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                        <HeartIcon size={35} color={isFavorite ? theme.background : "white"} />
                    </TouchableOpacity>
                </SafeAreaView>
                {
                    loading ? (<Loading />) :
                        (
                            <View>
                                <Image
                                    source={{ uri: image500(tvSeries?.backdrop_path) || fallbackMoviePoster }}
                                    style={{ width: width, height: height * 0.55 }}
                                />
                                <LinearGradient colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
                                    style={{ width: width, height: height * 0.4 }}
                                    start={{ x: 0.5, y: 0 }}
                                    end={{ x: 0.5, y: 1 }}
                                    className="absolute bottom-0"
                                />
                            </View>
                        )
                }
                {/* movie details */}
                <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
                    {/* title */}
                    <Text className="text-white text-center text-3xl font-bold tracking-wider">{tvSeries.name}</Text>
                    {/* status, release, runtime */}
                    {
                        tvSeries ? (
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {tvSeries?.status} * {tvSeries?.first_air_date?.split('-')[0]} * {tvSeries?.number_of_seasons} seasons
                            </Text>
                        ) : null
                    }
                    {/* genres */}
                    <View className="flex-row justify-center mx-4 space-x-2">
                        {
                            tvSeries?.genres?.map((genre, index) => {
                                let showDot = index + 1 != tvSeries?.genres?.length
                                return (
                                    <Text className="text-neutral-400 font-semibold text-base text-center" key={index}>
                                        {genre?.name} {showDot ? '*' : null}
                                    </Text>
                                )
                            })
                        }
                    </View>
                    {/* description */}
                    <Text className="text-neutral-400 mx-4 tracking-wide">{tvSeries?.overview}</Text>
                </View>
            </View>
            {/* all seasons */}
            {
                tvSeries.seasons && (
                    <View className="mt-4 space-y-4">
                        <Text className="mx-4 text-white text-xl">Seasons</Text>
                        <ScrollView horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                        >
                            {
                                tvSeries.seasons.map((season, index) => {
                                    return (
                                        <TouchableWithoutFeedback key={index}
                                            onPress={() => navigation.navigate('SeasonDetails', { season: season, tvSeries: tvSeries })}
                                        >
                                            <View className="space-y-1 mr-4">
                                                <Image source={{ uri: image185(season.poster_path) || fallbackMoviePoster }}
                                                    className="rounded-3xl"
                                                    style={{ width: width * 0.33, height: height * 0.22 }}
                                                />
                                                <Text className="text-center text-neutral-300 ml-1">{season.name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            }
            {/* youtube trailers */}
            {videos.length > 0 && <VideoList videos={videos} />}
            {/* cast */}
            {cast?.length > 0 && <Cast navigation={navigation} cast={cast} />}
            {/* similar tv series list */}
            {similarTvSeries?.length > 0 && <MovieList title="Similar TV Series" type="tv" hideSeeAll={true} data={similarTvSeries} />}
        </ScrollView>
    )
}