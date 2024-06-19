import { useNavigation, useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Dimensions, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline"
import MovieList from "../components/MovieList"
import { styles } from "../theme"
import Loading from "../components/Loading"
import { fetchPersonDetails, fetchPersonMovies, image342 } from "../api/moviedb"


const { width, height } = Dimensions.get('window')
const ios = Platform.OS == 'ios'
const verticalMargin = ios ? '' : 'my-3'
export default function PersonScreen() {
    const { params: item } = useRoute()
    const navigation = useNavigation()
    const [isFavorite, toggleFavorite] = useState(false)
    const [personMovies, setPersonMovies] = useState([])
    const [personDetails, setPersonDetails] = useState({})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getPersonDetails(item.id)
        getPersonMovies(item.id)
        setLoading(false)
    }, [item])

    const getPersonDetails = async (id) => {
        const data = await fetchPersonDetails(id)
        console.log(data);
        if (data) setPersonDetails(data)
    }

    const getPersonMovies = async (id) => {
        const data = await fetchPersonMovies(id)
        if (data && data.cast) setPersonMovies(data.cast)
    }

    return (
        <ScrollView className="flex-1 bg-neutral-900" contentContainerStyle={{ paddingBottom: 20 }}>
            {/* back button */}
            <SafeAreaView className={"absolute z-20 w-full flex-row justify-between items-center px-4 " + verticalMargin}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                    <HeartIcon size={35} color={isFavorite ? 'red' : "white"} />
                </TouchableOpacity>
            </SafeAreaView>
            {/* person details */}
            {
                loading ? (<Loading />) :
                    (
                        <View>
                            <View className="flex-row justify-center"
                                style={{ shadowColor: 'gray', shadowRadius: 40, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1 }}>
                                <View className="items-center rounded-full overflow-hidden h-72 w-72 border border-neutral-500">
                                    <Image source={{ uri: image342(personDetails?.profile_path) }}
                                        style={{ height: height * 0.43, width: width * 0.74 }}
                                    />
                                </View>
                            </View>
                            <View className="mt-6">
                                <Text className="text-3xl text-white font-bold text-center">{personDetails?.name}</Text>
                                <Text className="text-base text-neutral-500 text-center">{personDetails?.place_of_birth}</Text>
                            </View>
                            <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
                                <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                    <Text className="text-white font-semibold">Gender</Text>
                                    <Text className="text-neutral-300 text-sm">{personDetails?.gender == 1 ? 'Female' : 'Male'}</Text>
                                </View>
                                <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                    <Text className="text-white font-semibold">Birthday</Text>
                                    <Text className="text-neutral-300 text-sm">{personDetails?.birthday}</Text>
                                </View>
                                <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                    <Text className="text-white font-semibold">Known for</Text>
                                    <Text className="text-neutral-300 text-sm">{personDetails?.known_for_department}</Text>
                                </View>
                                <View className="px-2 items-center">
                                    <Text className="text-white font-semibold">Popular</Text>
                                    <Text className="text-neutral-300 text-sm">{personDetails?.popularity?.toFixed(2)}%</Text>
                                </View>
                            </View>
                            <View className="my-6 mx-4 space-y-2">
                                <Text className="text-white text-lg">Biography</Text>
                                <Text className="text-neutral-400 tracking-wide">{personDetails?.biography || 'N/A'}</Text>
                            </View>
                            {/* movies played */}
                            <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
                        </View>
                    )
            }
        </ScrollView>
    )
}