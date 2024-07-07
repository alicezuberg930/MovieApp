import { useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { Dimensions, Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { XMarkIcon } from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import Loading from "../components/Loading"
import { debounce } from 'lodash'
import { fallbackMoviePoster, image185, searchMovies, searchTVSeries } from "../api/moviedb"

const { width, height } = Dimensions.get('window')
export default function SearchScreen() {
    const navigation = useNavigation()
    const [results, setResults] = useState([])
    const [type, setType] = useState("tv_series")
    const [loading, setLoading] = useState(false)

    const handleSearch = async (value) => {
        console.log(type);

        if (value && value.length > 3) {
            setLoading(true)
            let data;
            if (type == "movie") {
                console.log("run movie");
                data = await searchMovies({
                    query: value,
                    include_adult: 'false',
                    page: '1',
                    language: 'en-US'
                })
            }
            if (type == "tv_series") {
                console.log("run tv series");
                data = await searchTVSeries({
                    query: value,
                    include_adult: 'false',
                    page: '1',
                    language: 'en-US'
                })
            }
            if (data && data.results) {
                setLoading(false)
                setResults(data.results)
            } else {
                setLoading(false)
                setResults([])
            }
        } else {
            setLoading(false)
            setResults([])
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 100), [])
    const bgColorMovie = type == "movie" ? "bg-indigo-500" : "bg-white"
    const bgColorTV = type == "tv_series" ? "bg-indigo-500" : "bg-white"
    return (
        <SafeAreaView className="bg-neutral-800 flex-1">
            <View className="mx-4 my-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
                <TextInput placeholder="Search movie" placeholderTextColor={'lightgray'}
                    onChangeText={handleSearch}
                    className="p-3 flex-1 text-base font-semibold text-white tracking-wider"
                />
                <TouchableOpacity onPress={() => navigation.navigate('Home')}
                    className="rounded-full m-1 bg-neutral-500 mr-2"
                >
                    <XMarkIcon size={25} color="white" />
                </TouchableOpacity>
            </View>
            <View className="flex-row mx-4 my-3 items-center justify-start">
                <TouchableOpacity className={"p-2 rounded-lg " + bgColorMovie}
                    onPress={() => {
                        setType("movie")
                        console.log(type);
                        setResults([])
                    }}
                >
                    <Text className="font-bold">Movies</Text>
                </TouchableOpacity>
                <View className="w-4"></View>
                <TouchableOpacity className={"p-2 rounded-lg " + bgColorTV}
                    onPress={() => {
                        setType("tv_series")
                        
                        console.log(type);
                        setResults([])
                    }}
                >
                    <Text className="font-bold">TV Series</Text>
                </TouchableOpacity>
            </View>
            {
                loading ? (<Loading />) :
                    results.length > 0 ? (
                        <ScrollView className="space-y-3 mx-3">
                            <Text className="text-white font-semibold">Results ({results.length})</Text>
                            <View className="flex-row justify-between flex-wrap">
                                {
                                    results.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback key={index} onPress={() => type == "movie" ?
                                                navigation.push('MovieDetails', item) : navigation.push('TvSeriesDetails', item)}
                                            >
                                                <View className="space-y-2 mb-4">
                                                    <Image className="rounded-3xl"
                                                        source={{ uri: image185(item?.poster_path) || fallbackMoviePoster }}
                                                        style={{ width: width * 0.44, height: height * 0.3 }}
                                                    />
                                                    <Text className="text-neutral-300 ml-1">
                                                        {type == "movie" ? item?.title.length > 22 ? item?.title.slice(0, 22) + '...' : item?.title
                                                            : item?.name.length > 22 ? item?.name.slice(0, 22) + '...' : item?.name}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    ) : (
                        <View className="flex-row justify-center">
                            <Image source={require('../assets/images/no_results.jpg')}
                                className="h-96 w-96"
                            />
                        </View>
                    )
            }

        </SafeAreaView >
    )
}