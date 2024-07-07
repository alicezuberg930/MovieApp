import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, Dimensions, Image, Platform, ScrollView, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid"
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, theme } from "../theme";
import LinearGradient from "react-native-linear-gradient";
import Cast from "../components/Cast";
import Loading from "../components/Loading";
import { fallbackMoviePoster, fetchTvSeriesEpisodeCredits, fetchTvSeriesEpisodeTrailerVideos, fetchTvSeriesSeasonDetails, image500 } from "../api/moviedb";
import { VideoList } from "../components/VideoList";

const { width, height } = Dimensions.get('window')
const ios = Platform.OS == 'ios'
const topMargin = ios ? '' : 'mt-3'
export default function SeasonDetailsScreen() {
    const navigation = useNavigation()
    const { params: item } = useRoute()
    const [season, setSeason] = useState({})
    const [episode, setEpisode] = useState({})
    const [loading, setLoading] = useState(true)
    const [cast, setCast] = useState([])
    const [videos, setVideos] = useState([])
    const [isFavorite, toggleFavorite] = useState(false)

    useEffect(() => {
        getSeasonDetails(item.tvSeries.id, item.season.season_number)
        setLoading(false)
    }, [item])

    const getSeasonDetails = async (id, season) => {
        let data = await fetchTvSeriesSeasonDetails(id, season)
        if (data) setSeason(data)
    }

    const getTvSeriesEpisodeCredits = async (id, season, episode) => {
        let data = await fetchTvSeriesEpisodeCredits(id, season, episode)
        if (data.cast) setCast(data.cast)
    }

    const getTvSeriesEpisodeTrailerVideos = async (id, season, episode) => {
        let data = await fetchTvSeriesEpisodeTrailerVideos(id, season, episode)
        console.log(data)
        if (data && data.results) setVideos(data.results)
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 bg-neutral-900">
            {/* back button + season poster */}
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
                                    source={{ uri: image500(season?.poster_path) || fallbackMoviePoster }}
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
                    <Text className="text-white text-center text-3xl font-bold tracking-wider">{season?.name}</Text>
                    {/* release, runtime */}
                    {
                        season ? (
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {season?.air_date} * {item.season.episode_count} episodes
                            </Text>
                        ) : null
                    }
                    {/* description */}
                    <Text className="text-neutral-400 mx-4 tracking-wide">{season?.overview}</Text>
                </View>
                {/* episode list */}
                <View className="space-y-4 my-4 mx-4">
                    <Text className="text-white text-xl">Episodes</Text>
                    <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            season.episodes ? (
                                season.episodes.map((episode, index) => {
                                    return (
                                        <TouchableWithoutFeedback key={index}
                                            onPress={() => {
                                                setEpisode(episode)
                                                getTvSeriesEpisodeCredits(item.tvSeries.id, season.season_number, episode.episode_number)
                                                getTvSeriesEpisodeTrailerVideos(item.tvSeries.id, season.season_number, episode.episode_number)
                                            }}
                                        >
                                            <View className="mx-2 w-10 h-10 rounded-xl bg-white justify-center items-center">
                                                <Text className="font-bold text-base">{episode.episode_number}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            ) : null
                        }
                    </ScrollView>
                </View>
                {/* episode details */}
                {
                    episode.name ? (
                        <View className="space-y-4 my-4 mx-4">
                            <Text className="text-white text-xl">Episode details</Text>
                            <View className="space-y-1">
                                <Text className="text-neutral-400 font-bold"><Text className="text-white">Name:</Text> {episode.name}</Text>
                                <Text className="text-neutral-400 font-bold"><Text className="text-white">Overview:</Text> {episode.overview}</Text>
                                <Text className="text-neutral-400 font-bold"><Text className="text-white">Runtime:</Text> {episode.runtime} minutes</Text>
                            </View>
                        </View>
                    ) : null
                }
                {/* youtube trailers */}
                {videos.length > 0 && <VideoList videos={videos} />}
                {/* guest star */}
                {
                    episode.guest_stars.length > 0 ? (
                        <Cast navigation={navigation} name="Guest Stars" cast={episode.guest_stars} />
                    ) : null
                }
                {/* cast */}
                {cast?.length > 0 && <Cast navigation={navigation} cast={cast} />}
            </View>
        </ScrollView>
    )
}